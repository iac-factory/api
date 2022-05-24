const Context = async () => {
    const { Connection: connection } = await import("..");

    console.log(connection);
}

export { Context };

export default Context;
