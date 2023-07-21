require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const saltRounds = Number(process.env.SALT_ROUNDS);
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

//Encrypting text
const encrypt = (text) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

// Decrypting text
const decrypt = (text) => {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.createToken = (id, email) => {
  const encryptedId = encrypt(id);
  const encryptedEmail = encrypt(email);
  const token = jwt.sign(
    { id: encryptedId, email: encryptedEmail },
    jwtPrivateKey
  );
  return token;
};

exports.validateToken = (token) => {
  try {
    const encriptedUser = jwt.verify(token, jwtPrivateKey);
    const encryptedId = encriptedUser.id;
    const encryptedEmail = encriptedUser.email;
    const id = decrypt(encryptedId);
    const email = decrypt(encryptedEmail);
    const user = {
      id: id,
      email: email,
    };
    return user;
  } catch (err) {
    return false;
  }
};


exports.hash=async (text)=>{
    try{
        const result= await bcrypt.hash(text, saltRounds);
        return result;
    }catch(err)
    {
        return false;
    }
    
}

exports.hashCompare=async (text,encriptedText)=>{

    try{
        const result = await bcrypt.compare(text,encriptedText);
        return result;
    }catch(err)
    {
        return false;
    }
    
}

exports.isNotValid = (str) => {
  if (str && str.length > 0) return false;
  return true;
};
