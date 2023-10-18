'use strict';

const promiseFS = require('fs/promises');
const fs = require('fs');
const path = require('path');

const Plugin = module.exports;

let items = [
	{
		url: "FMD_personibu_vakars",
		name: "FMD Personību vakars",
		images: ["\\assets\\uploads\\foto\\FMD Personību vakars 2023\\1.jpg", 
		"\\assets\\uploads\\foto\\FMD Personību vakars 2023\\2.jpg",
		"\\assets\\uploads\\foto\\FMD Personību vakars 2023\\3.jpg",
		"\\assets\\uploads\\foto\\FMD Personību vakars 2023\\4.jpg"]
	},
	{
		url: "FMD_CNP_2023",
		name: "FMD ČŅP 2023",
		images: ["\\assets\\uploads\\foto\\FMD ČŅP 2023\\1.jpg", 
		"\\assets\\uploads\\foto\\FMD ČŅP 2023\\2.jpg",
		"\\assets\\uploads\\foto\\FMD ČŅP 2023\\3.jpg",
		"\\assets\\uploads\\foto\\FMD ČŅP 2023\\4.jpg"]
	}
]

Plugin.defineWidgets = function(widgets) {
	widgets.push({
		name: "Image gallery",
		widget: "imageGallery",
		description: "Shows all the images in a specified folder as a galery.",
		content: '<input type=\"text\" name=\"myKey\" class=\"form-control\" />',
	});

	return widgets
}
//		{ "hook": "filter:widgets.getWidgets", "method": "defineWidgets", "callbacked": true },
//      { "hook": "filter:widget.render:imageGallery", "method": "renderWidget" },

Plugin.renderWidget = async function (widget) {
	let html = "<h2>Gallery</h2>";
	let files = await promiseFS.readdir('public/uploads/foto');
	if(files){
		files.forEach(file => {
			const filePath = path.join('/assets/uploads/foto/', file);
			html += `<img src="${filePath}" alt="file" width="100" height="100">`
		});
	}
	
	widget.html = html;
	return widget;

};

async function getAllImages(){
	let folders = await promiseFS.readdir('public/uploads/foto');
	let urls = [ {name: "Item", images : ["\\assets\\uploads\\foto\\FMD Personību vakars 2023\\2382_.jpg"]}]
	if(folders){
		folders.forEach(async folder => {
			const folderPath = path.join('public/uploads/foto', folder);
			let item = {name: folder, images : []}
			let files = await promiseFS.readdir(folderPath);
			if(files){
				files.forEach(async file => {
					const filePath = path.join("/assets/uploads/foto/", folder, file);
					
					item.images.push(filePath);
				});
			}
			urls.push(item)
		});
	}
	return urls;
}

async function getImagesFrom(folder){
	const folderPath = path.join('public/uploads/foto', folder);
	let urls = []
	let files = await promiseFS.readdir(folderPath);
	if(files){
		files.forEach(async file => {
			const filePath = path.join("/assets/uploads/foto/", folder, file);
			
			urls.push(filePath);
		});
	}
	return urls;
}

function cleanPath(path) {
	return path.replace(/\/(api\/)?/, '').replace(/\/$/, '');
}

Plugin.init = function(params) {

	params.router.get('/api/gallery', params.middleware.pageView, async function(req, res, next) { 

        res.render(cleanPath(req.path), {folder: items});
    });
	params.router.get('/gallery', params.middleware.buildHeader, async function(req, res, next) { 
        res.render(cleanPath(req.path), {folder: items});
    });
    params.router.get('/api/gallery/*', params.middleware.pageView, async function(req, res, next) { 
		let item = req.url.substring(req.url.lastIndexOf('/') + 1).split('?')[0]
		let result = items.find(obj => {
			return obj.url == item
		  })
		let images = []
		if(result){
			images = result.images;
		}
        res.render('singleGallery', {image: images});
    });
	params.router.get('/gallery/*', params.middleware.buildHeader, async function(req, res, next) { 
		let item = req.url.substring(req.url.lastIndexOf('/') + 1)
		let result = items.find(obj => {
			return obj.url == item
		  })
		let images = []
		if(result){
			images = result.images;
		}
        res.render('singleGallery', {image: images});
    });
	
}