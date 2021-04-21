
const playfair = require('crypto-classic-playfair');
const vc = require('vigenere-cipher');
const vernam = require('vernam-cipher')
const railfencecipher = require("railfencecipher")
const crypto = require('crypto');
var aes256 = require('aes256');
const file_manager = require("fs");
const Base64 = require('file-base64');
const fs = require('fs')
const Cryptify = require('cryptify');
const { PassThrough } = require('stream');
const fileDialog = require('file-dialog')


function new_tobase64(filelocation) {
    let myprm = new Promise(function(resolve,reject){
      /*Base64.encode(filelocation, function(err, base64String) {
        resolve(base64String)
      });*/
      base64string = fs.readFileSync(filelocation, {encoding: 'base64'});
      resolve(base64string)
    })
    return myprm 
}

function playfair_encrypt(txt,key){
    return ciperText = playfair.encipher(txt,key);
}

function playfair_decrypt(ctxt,key){
    return playfair.decipher(ctxt,key)
}

function vignere_encrypt(txt,key){
    return vc.encrypt(txt,key)
}

function vignere_decrypt(ctxt,key){
    return vc.decrypt(ctxt,key)
}

function vernam_encrypt(txt,key){
    return vernam.encrypt(txt,key)
}

function vernam_decrypt(ctxt,key){
    return vernam.decrypt(ctxt,key)
}

function railfence_encrypt(txt,key){
    return railfencecipher.encodeRailFenceCipher(txt,key)
}

function railfence_decrypt(ctxt,key){
    return railfencecipher.decodeRailFenceCipher(ctxt,key)
}

function des_encrypt(txt,key){
    const key_pass = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
    const cipher = crypto.createCipheriv('des-ede3', key_pass, '');
    let encrypted = cipher.update(txt, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted
}

function des_decrypt(txt,key){
    const key_pass = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
    const decipher = crypto.createDecipheriv('des-ede3', key_pass, ''); 
    let encrypted = decipher.update(txt, 'base64', 'utf8');
    encrypted += decipher.final('utf8');
    return encrypted;
}

function aes_encrypt(txt,key){
    return aes256.encrypt(key, txt);
}

function aes_decrypt(txt,key){
    return aes256.decrypt(key, txt);
}

function rsa_encrypt(txt,key_size){
    const key = new NodeRSA({b: key_size});
    const encrypted = key.encrypt(text, 'base64');
    return(encrypted,key.exportKey('private'),key.exportKey('public'))
}

function rsa_decrypt(txt,key){
    return key.decrypt(encrypted,'utf8')
}

function file_encrypt(file,key) //encrypting file using aes-256-cbc
{    
    const instance = new Cryptify(file, key);
    instance.encrypt().then((files) => {
        console.log(files)
        Swal.fire({
            icon: 'success',
            title: '<p style="color:#FFF";>Encrypted</p>',
            width: '350',
            html: '<p style="color:#FFF";>The file has been encrypted successfully</p>',
            background: '#000000',
            allowOutsideClick: true,
            showConfirmButton: true
          })
    })
}

function file_decrypt(file,key) //decrypting file using aes-256-cbc
{
    const instance = new Cryptify(file, key);
    instance
      .decrypt().then((files) => {
        console.log(files)
        Swal.fire({
            icon: 'success',
            title: '<p style="color:#FFF";>Decrypted</p>',
            width: '350',
            html: '<p style="color:#FFF";>The file has been decrypted successfully</p>',
            background: '#000000',
            allowOutsideClick: true,
            showConfirmButton: true
          })
    })
}

function file_select_encrypt(key)
{
    fileDialog({ multiple: false})
    .then(files => {
        file_encrypt(files[0].path,key)
    })
}

function file_select_decrypt(key)
{
    fileDialog({multiple: false})
    .then(files => {
        file_decrypt(files[0].path,key)
    })
}
// select item Onclick
(function() {

    var nav = document.getElementById('nav');

    function handleClick(e) {

        for(var i = 0; i < nav.children.length; i++) {
            nav.children[i].style.background = 'transparent';
        }
       e.target.style.background = 'red'; 
    }

    for(var i = 0; i < nav.children.length; i++) {
        nav.children[i].addEventListener('click', handleClick);
    }

})();