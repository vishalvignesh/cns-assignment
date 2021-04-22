
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
const Swal = require('sweetalert2')
const NodeRSA = require('node-rsa')

set_id = 0


html_des_aes = `      <input class="input is-info" id="txt1" type="text" placeholder="Plain Text | Encrypted Text" disabled>
<input class="input is-info" id="txt2" type="text" placeholder="Secret Password / Key" disabled>
<textarea class="textarea is-info" id="txt3" type="text" readonly disabled>Cipher Generated Key</textarea>
<textarea class="textarea is-info" id="txt4" placeholder="Cipher Text | Decrypted Text" disabled></textarea>


<div class="buttons has-addons is-centered mt-6">
  <button class="button is-success" onclick="encrypt_button_handler()" id="encrypt_button" disabled>Encrypt</button>
  <button class="button is-danger ml-2" onclick="decrypt_button_handler()" id="decrypt_button" disabled>Decrypt</button>
</div>`
html_others = `
<input class="input is-info" id="txt1" type="text" placeholder="Plain Text | Encrypted Text" disabled>
<input class="input is-info" id="txt2" type="text" placeholder="Secret Password / Key" disabled>
<textarea class="textarea is-info" id="txt4" placeholder="Cipher Text | Decrypted Text" disabled></textarea>


<div class="buttons has-addons is-centered mt-6">
<button class="button is-success" onclick="encrypt_button_handler()" id="encrypt_button" disabled>Encrypt</button>
<button class="button is-danger ml-2" onclick="decrypt_button_handler()" id="decrypt_button" disabled>Decrypt</button>
</div>`
html_file_encryption = `<input class="input is-info" id="txt2" type="text" placeholder="Secret Password / Key" disabled>
      <div class="buttons has-addons is-centered mt-6">
      <button class="button is-success" onclick="encrypt_button_handler()" id="encrypt_button" disabled>Encrypt</button>
      <button class="button is-danger ml-2" onclick="decrypt_button_handler()" id="decrypt_button" disabled>Decrypt</button>
      </div>`
html_rsa = `<input class="input is-info" id="txt1" type="text" placeholder="Plain Text | Encrypted Text" disabled>
<textarea class="textarea is-info" id="txt2" type="text" readonly disabled>Public Key</textarea>
<textarea class="textarea is-info" id="txt3" type="text" disabled>Private Key</textarea>
<textarea class="textarea is-info" id="txt4" placeholder="Cipher Text | Decrypted Text" disabled></textarea>


<div class="buttons has-addons is-centered mt-6">
<button class="button is-success" onclick="encrypt_button_handler()" id="encrypt_button" disabled>Encrypt</button>
<button class="button is-danger ml-2" onclick="decrypt_button_handler()" id="decrypt_button" disabled>Decrypt</button>
</div>`


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
    return [encrypted,key_pass]
}

function des_decrypt(txt,key){
    const key_pass = crypto.createHash('md5').update(key).digest("hex").substr(0, 24);
    const decipher = crypto.createDecipheriv('des-ede3', key_pass, ''); 
    let encrypted = decipher.update(txt, 'base64', 'utf8');
    encrypted += decipher.final('utf8');
    return [encrypted,key_pass]
}

function aes_encrypt(txt,key){
    return aes256.encrypt(key,txt)
}

function aes_decrypt(txt,key){
    return aes256.decrypt(key,txt)
}

function rsa_encrypt(txt){
    const key = new NodeRSA({b: 2048});
    console.log(key)
    const encrypted = key.encrypt(txt, 'base64');
    return[encrypted,key.exportKey('pkcs1-private-pem'),key.exportKey('pkcs8-public-pem')]
}

function rsa_decrypt(txt,key){
    const pvtkey = new NodeRSA(key,'pkcs1-private-pem');
    decrypted = pvtkey.decrypt(txt,'utf-8')
    return decrypted
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
    }).catch((e) => Swal.fire({
        icon: 'error',
        title: '<p style="color:#FFF";>Invalid Password</p>',
        width: '350',
        html: '<p style="color:#FFF";>The entered password is incorrect</p>',
        background: '#000000',
        allowOutsideClick: true,
        showConfirmButton: true
      }))
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

function enable_all(){
    var v1 = document.getElementById("txt1");
    var v2 = document.getElementById("txt2");
    var v4 = document.getElementById("txt4");
    var v5 = document.getElementById("encrypt_button");
    var v6 = document.getElementById("decrypt_button");


    v1.disabled = false
    v2.disabled = false
    v4.disabled = false
    v5.disabled = false
    v6.disabled = false
}
function enable_aes_des(){
    var v1 = document.getElementById("txt1");
    var v2 = document.getElementById("txt2");
    var v3 = document.getElementById("txt3");
    var v4 = document.getElementById("txt4");
    var v5 = document.getElementById("encrypt_button");
    var v6 = document.getElementById("decrypt_button");


    v1.disabled = false
    v2.disabled = false
    v3.disabled = false
    v4.disabled = false
    v5.disabled = false
    v6.disabled = false
}
function enable_file(){
    var v1 = document.getElementById("txt2");
    var v5 = document.getElementById("encrypt_button");
    var v6 = document.getElementById("decrypt_button");



    v1.disabled = false
    v5.disabled = false
    v6.disabled = false
}
function enable_rsa(){
    var v1 = document.getElementById("txt1");
    var v2 = document.getElementById("txt2");
    var v3 = document.getElementById("txt3");
    var v4 = document.getElementById("txt4");
    var v6 = document.getElementById("encrypt_button");
    var v7 = document.getElementById("decrypt_button");


    v1.disabled = false
    v2.disabled = false
    v3.disabled = false
    v4.disabled = false
    v6.disabled = false
    v7.disabled = false
}
function set_mode(id){
    if(id == 8){
        var res = document.getElementById('mainsection');
        res.innerHTML = html_file_encryption
        enable_file()

    }
    else if(id == 5 || id == 6){
        var res = document.getElementById('mainsection');
        res.innerHTML = html_des_aes
        enable_aes_des()

    }
    else if(id == 7){
        var res = document.getElementById('mainsection');
        res.innerHTML = html_rsa
        enable_rsa()

    }
    else{
        var res = document.getElementById('mainsection');
        res.innerHTML = html_others
        enable_all()

    } 

    set_id = id
    var ul = document.getElementById("nav");
    var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; i++) {
        items[i].style.background = 'transparent'
    }
    items[id-1].style.background = 'green'
}
function reload_page(){
    window.location.reload();
    set_id = 0
}
function encrypt_button_handler(){
    if(set_id == 8){
        var v1 = document.getElementById("txt2");
        const pass = v1.value;
        file_select_encrypt(pass)
    }
    else if(set_id == 5 || set_id == 6){
        var v1 = document.getElementById("txt1");
        var v2 = document.getElementById("txt2");
        var v3 = document.getElementById("txt3");
        var v4 = document.getElementById("txt4");

        if(set_id == 5){

            txt_enc = v1.value
            pass = v2.value
            res = des_encrypt(txt_enc,pass)
            
            v3.value = res[1]
            v4.value = res[0]
        }
        else {

            txt_enc = v1.value
            pass = v2.value
            res = aes_encrypt(txt_enc,pass)
            
            v4.value = res[0]
            v3.value = res[1].toString('base64')
        }

    }
    else if(set_id == 7){
        var v1 = document.getElementById("txt1");
        var v2 = document.getElementById("txt2");
        var v3 = document.getElementById("txt3");
        var v4 = document.getElementById("txt4");

        txt = v1.value
        res = rsa_encrypt(txt)
        v4.value = res[0]
        
        v3.value = res[1]
        v2.value = res[2]
        
    }
    else{
        var v1 = document.getElementById("txt1");
        var v2 = document.getElementById("txt2");
        var v4 = document.getElementById("txt4");

        txt = v1.value
        pass = v2.value

        console.log(txt,pass)
        if(set_id == 1)v4.value = playfair_encrypt(txt,pass)
        else if(set_id == 2) v4.value = vignere_encrypt(txt,pass)
        else if(set_id == 3) v4.value = vernam_encrypt(txt,pass)
        else v4.value = railfence_encrypt(txt,pass)

    } 
}
function decrypt_button_handler(){
    if(set_id == 8){
        var v1 = document.getElementById("txt2");
        const pass = v1.value;
        file_select_decrypt(pass)
    }
    else if(set_id == 5 || set_id == 6){
        var v1 = document.getElementById("txt1");
        var v2 = document.getElementById("txt2");
        var v3 = document.getElementById("txt3");
        var v4 = document.getElementById("txt4");

        if(set_id == 5){
            txt_enc = v1.value
            pass = v2.value
            res = des_decrypt(txt_enc,pass)
            
            v3.value = res[1]
            v4.value = res[0]
        }
        else {
            txt_enc = v1.value
            pass = v2.value
            res = aes_decrypt(txt_enc,pass)
            
            v4.value = res[0]
            v3.value = res[1].toString('base64')
        }

    }
    else if(set_id == 7){
        var v1 = document.getElementById("txt1");
        var v2 = document.getElementById("txt2");
        var v3 = document.getElementById("txt3");
        var v4 = document.getElementById("txt4");

        txt = v1.value
        pvt_key = v3.value
        res = rsa_decrypt(txt,pvt_key)
        v4.value = res
    

    }
    else{
        var v1 = document.getElementById("txt1");
        var v2 = document.getElementById("txt2");
        var v4 = document.getElementById("txt4");

        txt = v1.value
        pass = v2.value

        if(set_id == 1)v4.value = playfair_encrypt(txt,pass)
        else if(set_id == 2) v4.value = vignere_decrypt(txt,pass)
        else if(set_id == 3) v4.value = vernam_decrypt(txt,pass)
        else v4.value = railfence_decrypt(txt,pass)


    } 
}