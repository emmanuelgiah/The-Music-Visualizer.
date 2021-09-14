//sound instance variables
let song, amplitude, frequency;
let songTitle = "AZUD.mp3";
//button instance variables
let resume, pause;
//color instance variables
let redChannel = 0;
let greenChannel = 0;
let blueChannel = 0;
//maximum and minimum
let maximumFrequency = 0;
let minimumFrequency = 1000000;
//loading the songs
function preload() {
	song = loadSound("assets/" + songTitle)
}

function setup() {
	createCanvas(windowWidth-20, windowHeight-20);
	background(0, 0, 0);
	amplitude = new p5.Amplitude();
	frequency = new p5.FFT();
	//create buttons
	resume = createButton('play');
	pause = createButton('pause');

	resume.position(30, 315);
	pause.position(110, 315);

	resume.mousePressed(playSong);
	pause.mousePressed(stopSong);
}

function draw() {
	//output frequency amplitude
	let hertz = frequency.analyze();
	let currentFrequency = showFrequency(hertz);
	//set black background
	let level = amplitude.getLevel();
	let dissonance = level + 1 + ((maximumFrequency - minimumFrequency)/100);
	if (maximumFrequency >= 120) {
		greenChannel = maximumFrequency;
		blueChannel = minimumFrequency;
		redChannel = (greenChannel + blueChannel) / 2;
	} else if (maximumFrequency < 120 && maximumFrequency >= 60) {
		redChannel = maximumFrequency;
		blueChannel = minimumFrequency;
		greenChannel = (redChannel + blueChannel) / 2;
	} else if (maximumFrequency > 0 && maximumFrequency < 60) {
		blueChannel = maximumFrequency;
		greenChannel = minimumFrequency;
		redChannel = (greenChannel + blueChannel) / 2;
	} else if (maximumFrequency == 0) {
		redChannel = 0;
		greenChanel = 0;
		blueChannel = 0;
	}
	background(redChannel, greenChannel, blueChannel);
	showVolume(level);
	//draw spectrum
	noStroke();
	fill(255, 255, 255);
	for (var i = 0; i< hertz.length; i++){
		let x = map(i, 0, hertz.length, 0, width);
		let h = -height + map(hertz[i], 0, 255, height, 0);
		rect(x, height, width / hertz.length, h )
	}
	//getting the range of hertz
	if (currentFrequency > maximumFrequency) {
		maximumFrequency = currentFrequency;
	}
	if (currentFrequency > 0 && currentFrequency < minimumFrequency) {
		minimumFrequency = currentFrequency;
	}
	fill(255, 0, 255);
	text("Highest Frequency: " + maximumFrequency, 25, 205);
	fill(255, 255, 0);
	text("Lowest Frequency: " + minimumFrequency, 25, 260);
	//song name
	fill(255, 255, 255);
	text("Now Playing: " + songTitle, 25, 40)
}

//automatic resizing
function windowResized() {
	resizeCanvas(windowWidth-20, windowHeight-20);
}
//button functions
function playSong() {
	song.stop();
	song.play();

	maximumFrequency = 0;
	minimumFrequency = 1000;
}

function stopSong() {
	song.stop();

	maximumFrequency = 0;
	minimumFrequency = 1000;
}
//output functions
function showVolume(level) {
	textSize(36);
	fill(255, 255, 255);
	text("Volume Level: " + level, 25, 95);
	//UI Information
	if (level <= .15) {
		fill(255, 255, 0);
		text("Quiet", 700, 95);
	} else if (level > .15 && level <= .25) {
		fill(0, 255, 0);
		text("Moderate", 700, 95);
	} else if (level > .25) {
		fill(255, 0, 0);
		text("Loud", 700, 95);
	}
}
//frequency manipulations
function showFrequency(hertz) {
	textSize(36);
	let sum = 0;
	let average = 0;
	let max = hertz[0];
	let min = hertz[1];
	for (i = 0; i < hertz.length; i++) {
		sum += hertz[i];
	}
	average = sum/hertz.length;
	fill(255, 255, 255);
	text("Frequency: " + average, 25, 150);

	return average;
}