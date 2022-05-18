export const Parse = (string: string) => {
    const data: { match : RegExpExecArray | null, groups: {[$: string]: string} | undefined | null } = { match: null, groups: {} };
    const expression = new RegExp("(?<hostname>(git@|https://)([\\w\\.@]+)(/|:))(?<namespace>[\\w,\\-,\\_]+)/(?<name>[\\w,\\-,\\_]+)(.git)?((/)?)", "igm");

    const groups = expression.exec(string)!.groups;

    (groups) && Object.assign(data.groups, groups);

    return data.groups as { hostname: string; namespace: string; name: string };
};

export default Parse;