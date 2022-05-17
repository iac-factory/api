import { Client } from ".";

export const Resources = async () => {
    const configurations = await Client.Functions();

    return (configurations) ? configurations : null;
};

export default Resources;
