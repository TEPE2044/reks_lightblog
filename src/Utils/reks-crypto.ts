import sha256 from "fast-sha256";

const hashPsw = (password:string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = sha256(data);
    return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('')
}

export { hashPsw };