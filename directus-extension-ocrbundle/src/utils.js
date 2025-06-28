export const bufferFromStream = async (stream) => {
    return new Promise((resolve, reject) => {
        const _buf = Array();
        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
};
