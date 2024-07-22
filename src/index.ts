declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d');

const colorPickerButton = document.getElementById('colorPickerButton') as HTMLButtonElement;
const display = document.getElementById('display') as HTMLDivElement;

let isZoomEnabled = false;

const buttonImg = new Image();
buttonImg.src = require('./assets/IconColorPicker.svg').default;
buttonImg.onload = () => {
    // Создание объекта для кнопки и установка фона с изображением
    colorPickerButton.style.backgroundImage = `url(${buttonImg.src})`;
    colorPickerButton.style.width = `${buttonImg.width}px`;
    colorPickerButton.style.height = `${buttonImg.height}px`;
};

const img = new Image();
img.src = require('./assets/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg').default;

const overlayImg = new Image();
overlayImg.src = require('./assets/Selected Color.png').default;

img.onload = () => {
    const width = img.width;
    const height = img.height;
    console.log(`Width: ${width}, Height: ${height}`);
    
    canvas.width = width;
    canvas.height = height;

    context!.drawImage(img, 0, 0, canvas.width, canvas.height);
};

colorPickerButton.addEventListener('click', () => {
    isZoomEnabled = !isZoomEnabled;
    display.textContent = isZoomEnabled ? 'Zoom Enabled' : 'Zoom Disabled';
});

canvas.addEventListener('mousemove', (event) => {
    if (!context || !isZoomEnabled) return;

    const zoomRadius = 50; 
    const zoomScale = 5; 

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    const sx = x - zoomRadius / zoomScale;
    const sy = y - zoomRadius / zoomScale;
    const sWidth = zoomRadius / zoomScale * 2;
    const sHeight = zoomRadius / zoomScale * 2;

    const dx = x - zoomRadius;
    const dy = y - zoomRadius;
    const dWidth = zoomRadius * 2;
    const dHeight = zoomRadius * 2;

    context.save();
    
    context.beginPath();
    context.arc(x, y, zoomRadius, 0, Math.PI * 2);
    context.closePath();
    context.clip();

    context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    context.restore();
    context.drawImage(overlayImg, x - zoomRadius, y - zoomRadius, zoomRadius * 2, zoomRadius * 2);
});

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (num: number) => num.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

canvas.addEventListener('click', (event) => {
    if (!context || !isZoomEnabled) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixel = context.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const hex = rgbToHex(r, g, b);
    display.textContent = `Color Code: ${hex}`;
});
