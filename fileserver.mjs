// 설정 변수 변경
const maxFileSize = 2000000;  // 최대 화일 크기 (기본값 2MB)
const host = '127.5.5.5';  // 호스트 주소
const port = 27775;  // 포트

import http from 'http';
import path from 'path';
import express, { static as serveStatic } from 'express';
import { json, urlencoded } from 'body-parser';
import fs from 'fs';
import fileUpload from 'express-fileupload';

import { sha256 } from 'js-sha256';
import sizeOf from 'image-size';

function print(x) { console.log(x); }
function prt(x) { process.stdout.write(x); }

const server = express();

server.use(json());
server.use(urlencoded({ extended: true }));
server.use(fileUpload({
	limits: { fileSize: maxFileSize },
    abortOnLimit: true,
})); 

server.disable('x-powered-by');

server.post('/upload', function(req, res) {
	if(!req.files || !req.files.file)
		return res.status(400).send('');	
	const file = req.files.file;
	const hash = sha256(file.data);
	file.mv(`./images/${hash.slice(0, 2)}/${hash}`, err => {
		if(err)
			return res.json({ status: 'error' });
		var w = 0, h = 0;
		sizeOf(`./images/${hash.slice(0, 2)}/${hash}`, function (err, dimensions) {
			if(!err) w = dimensions.width, h = dimensions.height;
			return res.json({ status: 'success', name: file.name, hash, size: file.data.length, width: w, height: h });
		});
	});
});

server.use('/', serveStatic('images'));

server.listen(port, host);
print(host + (port == 80 ? '' : (':' + port)) + '에서 실행 중. . .');
