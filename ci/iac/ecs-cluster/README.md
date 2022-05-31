## Security ##

![img.png](img.png)

> *The confused deputy problem is a security issue where an
> entity that doesn't have permission to perform an action can
> coerce a more-privileged entity to perform the action.*

### Overview ###

1. When you start using Example Corp's service, you provide the ARN of AWS1:ExampleRole to Example Corp.
2. Example Corp uses that role ARN to obtain temporary security credentials to access resources in your AWS account. In this way, you are trusting Example Corp as a "deputy" that can act on your behalf.
3. Another AWS customer also starts using Example Corp's service, and this customer also provides the ARN of AWS1:ExampleRole for Example Corp to use. Presumably the other customer learned or guessed the AWS1:ExampleRole, which isn't a secret.
4. When the other customer asks Example Corp to access AWS resources in (what it claims to be) its account, Example Corp uses AWS1:ExampleRole to access resources in your account.
5. This is how the other customer could gain unauthorized access to your resources. Because this other customer was able to trick Example Corp into unwittingly acting on your resources, Example Corp is now a "confused deputy."
                             
#### Solution ####

Example Corp can address the confused deputy problem by requiring that you include the ExternalId 
condition check in the role's trust policy. Example Corp generates a unique ExternalId value for
each customer and uses that value in its request to assume the role. 

The ExternalId value must be
unique among Example Corp's customers and controlled by Example Corp, not its customers. This is 
why you get it from Example Corp and you don't come up with it on your own. This prevents Example
Corp from being a confused deputy and granting access to another account's AWS resources.
                                                                            
***AWS performs this same functionality for its AWS-Cloud customers***. 

But the same can be had downstream for a AWS-Cloud Customer's customer(s)... and so on...

### Example Walk-Through ###

In the context of *the confused deputy problem*, the *action* a malicious actor will be performing:
- *The destruction of a production-related service through data-mining of a development-related service*.

In order to realize the full extend of the likelihood of the either the last, or the following section,
let us consider the following thought process a developer may have when
engineering an authentication system:

- The developer is in charge of engineering a authentication system.
- The developer uses an easily remembered username (ex. `admin`) in the "development environment"
- The developer doesn't want to update their password for the new front-end service as a single password is used for most applications.
- The developer caters the authentication system's minimum requirements according to their common catch-all password.

While such may be true, how did the malicious actor know where to sign into the organization's AWS account?
- Like hundreds of thousands of other organizations, the AWS account is setup to use
a login alias rather than the original `account-id`. The organization *`Organization`*,
therefore, uses the login alias `Organization`. 

A "*script-kitty*", or an entry-level-like hacker could then, easily,
infer the login url. As a less generalized example, lets say a company named `Cloud-Technology LLC`
uses AWS, which the malicious actor knew from header-analysis on the organizations front-page (`x-amz-cloudfront-distribution`).
Now, there are quite a few login combinations just a three-word-separated organization name could have:

- `Cloud-Technology-LLC`
- `Cloud-Technology`
- `cloud-technology`
- ... etc., etc., etc.

Furthermore, A 1st year college student would have enough experience to programmatically generate
a list of potential logins from just the organization's name alone. The aforementioned list becomes: 

- `https://Cloud-Technology-LLC.signin.aws.amazon.com/console/`
- `https://Cloud-Technology.signin.aws.amazon.com/console/`
- `https://cloud-technology.signin.aws.amazon.com/console/`
                                                             
However, AWS will forcefully lowercase the organization's name when determining the appropriate
http-redirect for console sign-in -- that concept alone has now made it just that much easier to
sign-in.

Using a program that interfaces a Tor-capable VPN and rate-limiter, the actor can now cascade the generated list -- programmatically -- without so much as lifting a single finger.

The first password on the list? **The same one that was used to sign into the developer's "development environment"'s application**.

Lastly, there's the question as to how the actor determined the appropriate login ***username***. While I'm intentionally leaving that portion
out of scope here... The reality is that it's just as easy to calculate those potential usernames, too.

- It's impossible to block an infinitely large number of username-password combinations as a function of IP addresses (remember, the actor
was using a tor VPN with ever-changing IPs). Therefore, such is *typically* impossible to prevent.
  - The only *immediate* solution includes a white-list, which most organizations do not implement, and with good reason with much 
  better, standardized practices being available.

Before jumping into the example, let us exclaim the paradigm that prevents any of this from reaching possibility:
   - **Multi-Factor-Authentication**

***It never pays more in the end when the start was done incorrectly***. 

Yeah, I'm pointing a finger at you, bad feature-hungry managers and unqualified, ill-informed executive officers...

Anyways, in summary:

1. The developer uses the same password for many sign-ins.
2. The developer doesn't want to engineer a password policy that prevents point 1.
3. The developer uses the same password across AWS account(s)
4. The developer uses the same password across their custom authentication system.
5. The developer implements the same authentication system across environments.

Back to the example ...

The same malicious actor acknowledges that across organizations, typically, organizations use the same login
name as their business; in reference to the walk-through, generating a list of those same AWS account logins
is hardly anymore difficult. Given that there's a "development environment", there probably exists exists
different AWS accounts, too. 

Finally are we now at a point to understand **The Confused Deputy Problem** -- which translates to 

> *The confused deputy problem is a security issue where an
> entity that doesn't have permission to perform an action can
> coerce a more-privileged entity to perform the action.*

System administrators typically try everything in their power to avoid lower-environment-related
configuration(s) from leaking into logic that successfully authenticates into their production environment(s).

However, they're often without either the experience nor acknowledgement of the underlying services that authenticate
in the first place. If they allow, even a few, lower-environment developers access to their production AWS accounts,
of course they cannot prevent what they determine to use as a password. But what happens when the development environment,
which is publicly accessible, has a leak?

Well chances are... they're of course going to use the same login username (probably `john.doe@organization.com`), and
because the actor is perhaps slightly more experienced than the average lazy engineer, I would know to... try exactly 
that same username-password combination against a now newly generated `Cloud-Technology-Production` set of AWS console sign-in urls.

And without MFA enablement? ***I would be successful***.

But who was the confused deputy, here? AWS, or the organization? Maybe the developer?

If that's not understood at this point, that's because it shouldn't be, intentionally. It's a layered
concept that doesn't necessarily always affect entities the same way.

AWS is unopinionated about what types of services your organization can provide. But as a key-takeaway, either if the organization
is providing downstream customer support, or if there's separation of AWS accounts per organization's "Environment",
the confused deputy problem can and drastically does affect all use-cases. Therefore, it's important to know how to
address and prevent them from occurring in the first place...

Especially as cross-account capabilities begin to attract cloud engineers or alike system administrators
and developers.

### Configuration ###

The rest of the [Security](#security) section provides configuration(s) that both avoids and prevents
any of the above (and more importantly, similar confused deputy-like authentication points) from
becoming a problem (also assuming MFA is enabled for individual IAM accounts).

#### IAM Policy Permissions ####
            
***Load Balancer*** - IAM Logging Policy:
```json
{
    "Condition": {
        "StringEquals": {
            "aws:SourceAccount": "[Account-ID]"
        }
    },
    "ArnLike": {
        "arn:aws:s3:::bucket-name/prefix/AWSLogs/your-aws-account-id/*"
    }
}
```

Please see the [Elastic Load Balancer Global Account IDs](#elastic-load-balancer-global-account-ids) section's table for reference.

## Elastic Load Balancer Global Account IDs ## 

|     Region      |        Region name        | Elastic Load Balancing account ID |
|:---------------:|:-------------------------:|:---------------------------------:|
|    us-east-1    |   US East (N. Virginia)   |           127311923021            |
|    us-east-2    |      US East (Ohio)       |           033677994240            |
|    us-west-1    |  US West (N. California)  |           027434742980            |
|    us-west-2    |     US West (Oregon)      |           797873946194            |
|   af-south-1    |    Africa (Cape Town)     |           098369216593            |
|  ca-central-1   |     Canada (Central)      |           985666609251            |
|  eu-central-1   |    Europe (Frankfurt)     |           054676820928            |
|    eu-west-1    |     Europe (Ireland)      |           156460612806            |
|    eu-west-2    |      Europe (London)      |           652711504416            |
|   eu-south-1    |      Europe (Milan)       |           635631232127            |
|    eu-west-3    |      Europe (Paris)       |           009996457667            |
|   eu-north-1    |    Europe (Stockholm)     |           897822967062            |
|    ap-east-1    | Asia Pacific (Hong Kong)  |           754344448648            |
| ap-northeast-1  |   Asia Pacific (Tokyo)    |           582318560864            |
| ap-northeast-2  |   Asia Pacific (Seoul)    |           600734575887            |
| ap-northeast-3  |   Asia Pacific (Osaka)    |           383597477331            |
| ap-southeast-1  | Asia Pacific (Singapore)  |           114774131450            |
| ap-southeast-2  |   Asia Pacific (Sydney)   |           783225319266            |
| ap-southeast-3  |  Asia Pacific (Jakarta)   |           589379963580            |
|   ap-south-1    |   Asia Pacific (Mumbai)   |           718504428378            |
|   me-south-1    |   Middle East (Bahrain)   |           076674570225            |
|    sa-east-1    | South America (São Paulo) |           507241528517            |
| us-gov-west-1*  |  AWS GovCloud (US-West)   |           048591011584            |
| us-gov-east-1*  |  AWS GovCloud (US-East)   |           190560391635            |
|   cn-north-1*   |      China (Beijing)      |           638102146993            |
| cn-northwest-1* |      China (Ningxia)      |           037604701340            |
          

## References ##

- [*The Confused Deputy Problem*](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)
