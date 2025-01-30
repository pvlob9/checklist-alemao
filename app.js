// Preencher automaticamente a data
document.getElementById('data').value = new Date().toLocaleDateString();

// Lista de peças internas
const partsList = [
    "Acabamento Cintos", "Acabamento Trilhos", "Alavancas", "Apoio Braço", "Botões Banco", 
    "Carenagens", "Carpete", "Colunas", "Console", "Estrutura", "Laterais", "Painel", "Película Vidro", 
    "Rondanas", "Soleiras", "Suporte Extintor", "Tela DVD Apoio", "Teto", "Trava elétrica", "Trilhos", 
    "Tuchos", "Vidro Elétrico", "Volante", "Rádio / DVD", "Volante / Buzina", "Ar Condicionado", 
    "Luzes internas", "Step / Macaco / Chave de roda", "Tapetes", "Rodas"
];

// Seleciona o contêiner onde as opções de seleção serão inseridas
const internalPartsContainer = document.getElementById('internalParts');

// Gera as opções para cada peça interna
partsList.forEach(part => {
    const li = document.createElement('li');
    li.innerHTML = `${part}: 
        <select class="custom-select">
            <option value="Não Possui">NÃO POSSUI</option>
            <option value="BOM ESTADO">BOM ESTADO</option>
            <option value="SUJO">SUJO</option>
            <option value="RISCADO">RISCADO</option>
            <option value="QUEBRADO">QUEBRADO</option>
        </select>`;
    internalPartsContainer.appendChild(li);
});

// Assinatura digital
const signaturePad = document.getElementById('signaturePad');
const signatureCtx = signaturePad.getContext('2d');
let drawing = false;

const startDrawing = (event) => {
    drawing = true;
    const { offsetX, offsetY } = getEventCoordinates(event);
    signatureCtx.beginPath();
    signatureCtx.moveTo(offsetX, offsetY);
};

const stopDrawing = () => {
    drawing = false;
};

const draw = (event) => {
    if (drawing) {
        const { offsetX, offsetY } = getEventCoordinates(event);
        signatureCtx.lineTo(offsetX, offsetY);
        signatureCtx.stroke();
    }
};

// Função para obter as coordenadas do toque ou do mouse
const getEventCoordinates = (event) => {
    const rect = signaturePad.getBoundingClientRect();
    const x = event.clientX || event.touches[0].clientX;
    const y = event.clientY || event.touches[0].clientY;
    return {
        offsetX: x - rect.left,
        offsetY: y - rect.top
    };
};

// Eventos para dispositivos com mouse
signaturePad.addEventListener('mousedown', startDrawing);
signaturePad.addEventListener('mousemove', draw);
signaturePad.addEventListener('mouseup', stopDrawing);

// Eventos para dispositivos com toque
signaturePad.addEventListener('touchstart', (event) => {
    event.preventDefault();  // Impede o comportamento padrão de scroll
    startDrawing(event);
});
signaturePad.addEventListener('touchmove', (event) => {
    event.preventDefault();  // Impede o comportamento padrão de scroll
    draw(event);
});
signaturePad.addEventListener('touchend', stopDrawing);

document.getElementById('clearSignature').addEventListener('click', () => {
    signatureCtx.clearRect(0, 0, signaturePad.width, signaturePad.height);
});

// Função para obter a data e hora atual
function getCurrentDateTime() {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

// Função para exibir a foto e legenda com botão de exclusão
function displayPhoto(photoFile, caption) {
    const photoWrapper = document.createElement('div');
    photoWrapper.classList.add('photo-wrapper');
    photoWrapper.style.position = 'relative';

    const photoElement = document.createElement('img');
    photoElement.src = URL.createObjectURL(photoFile);
    photoElement.alt = caption;
    photoElement.style.width = '150px';
    photoElement.style.height = 'auto';

    const captionElement = document.createElement('p');
    captionElement.textContent = caption;

    const dateElement = document.createElement('small');
    dateElement.textContent = `Data e Hora: ${getCurrentDateTime()}`;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️';
    deleteButton.classList.add('delete-button');
    
    deleteButton.addEventListener('click', () => {
        photoWrapper.remove();
    });

    photoWrapper.appendChild(photoElement);
    photoWrapper.appendChild(captionElement);
    photoWrapper.appendChild(dateElement);
    photoWrapper.appendChild(deleteButton);
    photosContainer.appendChild(photoWrapper);
}

// Seleciona os elementos da página
const photoInput = document.getElementById('photoInput');
const photoCaption = document.getElementById('photoCaption');
const addPhotoButton = document.getElementById('addPhotoButton');
const photosContainer = document.getElementById('photosContainer');

// Habilita ou desabilita o campo de texto baseado na escolha do usuário
photoCaptionSelect.addEventListener('change', function () {
    if (this.value === 'Outro') {
        photoCaption.disabled = false; // Habilita o campo de texto
        photoCaption.focus(); // Coloca o cursor no campo
    } else {
        photoCaption.disabled = true; // Desabilita o campo de texto
        photoCaption.value = ''; // Limpa o campo
    }
});

// Função para adicionar foto
addPhotoButton.addEventListener('click', function () {
    const photoFile = photoInput.files[0];
    const selectedCaption = photoCaptionSelect.value;
    const customCaption = photoCaption.value.trim();

    let finalCaption = selectedCaption;

    // Se o usuário escolheu "Outro" e digitou algo, usa o texto digitado
    if (selectedCaption === 'Outro' && customCaption) {
        finalCaption = customCaption;
    }

    if (photoFile && finalCaption) {
        displayPhoto(photoFile, finalCaption);
        photoCaption.value = '';
        photoCaptionSelect.value = ''; // Reseta o select
        photoInput.value = ''; 
        photoCaption.disabled = true; // Desativa o campo de texto novamente
    } else {
        alert('Por favor, adicione uma foto e uma legenda.');
    }
});

// Função para capturar foto e exibir
function capturePhoto(buttonId, label) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'camera';

    fileInput.click();

    fileInput.onchange = function() {
        const file = fileInput.files[0];
        if (file) {
            displayPhoto(file, label);
        }
    };
}

let uploadedImages = []; // Array global para armazenar os links das imagens
const apiKey = '5e04ad1430cad99ab0dded29db1658c9';

// Função para fazer upload para ImgBB
function uploadToImgBB(file, callback) {
    const formData = new FormData();
    formData.append('image', file);

    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.url) {
            uploadedImages.push(data.data.url); // Salva a URL da imagem no array global
            callback(data.data.url);
        } else {
            console.error('Erro no upload da imagem:', data);
        }
    })
    .catch(error => console.error('Erro na requisição:', error));
}

// Enviar imagens
document.getElementById('submitBtn').addEventListener('click', function () {
    const photoWrappers = document.querySelectorAll('.photo-wrapper img');

    if (photoWrappers.length === 0) {
        alert('Nenhuma imagem foi adicionada!');
        return;
    }

    let uploadCount = 0;
    uploadedImages = []; // Limpa a lista antes de fazer novos uploads

    photoWrappers.forEach(img => {
        fetch(img.src)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], "image.jpg", { type: blob.type });

                uploadToImgBB(file, function(imageUrl) {
                    uploadCount++;

                    if (uploadCount === photoWrappers.length) {
                        alert('Fotos salvas com sucesso!\nImagens:\n' + uploadedImages.join("\n"));
                    }
                });
            })
            .catch(error => console.error('Erro ao processar a imagem:', error));
    });
});

// Função para capturar as respostas selecionadas no checklist
function getChecklistResponses() {
    let responses = [];
    document.querySelectorAll('.custom-select').forEach((select, index) => {
        responses.push({
            part: partsList[index],  // Nome da peça
            answer: select.value     // Resposta selecionada
        });
    });
    return responses;
}

// Função para capturar a assinatura do cliente
function getSignature() {
    const signaturePad = document.getElementById('signaturePad');
    return signaturePad.toDataURL();  // Captura a assinatura como imagem base64
}

// Função para baixar o checklist com as imagens
function baixarChecklistComoHTML() {
    const nome = document.getElementById('nome').value;
    const os = document.getElementById('os').value;
    const cliente = document.getElementById('cliente').value;
    const data = document.getElementById('data').value;
    
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const placa = document.getElementById('placa').value;
    const quilometragem = document.getElementById('quilometragem').value;

    // Captura as respostas do checklist
    const checklistResponses = getChecklistResponses();
    let checklistSection = '<h3>Peças Internas:</h3><ul>';
    checklistResponses.forEach(item => {
        checklistSection += `<li><strong>${item.part}:</strong> ${item.answer}</li>`;
    });
    checklistSection += '</ul>';

    // Criar lista com os links das imagens
    let photosSection = '';
    if (uploadedImages.length > 0) {
        photosSection = '<div><h3>Fotos:</h3><ul>';
        uploadedImages.forEach(url => {
            photosSection += `<li><a href="${url}" target="_blank">${url}</a></li>`;
        });
        photosSection += '</ul></div>';
    }

    // Captura a assinatura
    const signatureImage = getSignature();

     // Criar o HTML
    let htmlContent = `
    <html>
        <head>
            <title>Checklist do Veículo</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { margin: 20px; }
                h1 { text-align: center; }
                .field { margin: 10px 0; }
                label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Checklist do Veículo</h1>
                
                <div class="field"><label>Nome:</label> ${nome}</div>
                <div class="field"><label>O.S:</label> ${os}</div>
                <div class="field"><label>Cliente:</label> ${cliente}</div>
                <div class="field"><label>Data:</label> ${data}</div>
                
                <div class="field"><label>Marca:</label> ${marca}</div>
                <div class="field"><label>Modelo:</label> ${modelo}</div>
                <div class="field"><label>Placa:</label> ${placa}</div>
                <div class="field"><label>Quilometragem:</label> ${quilometragem}</div>
                
                ${checklistSection}
                ${photosSection}

                <div class="field"><label>Assinatura do Cliente:</label></div>
                <div><img src="${signatureImage}" alt="Assinatura do Cliente" style="width: 300px; height: auto;"></div>
                <p>Declaro estar ciente dos defeitos já existentes e apontados nessa vistoria.</p>
                </div>
            </div>
        </body>
    </html>
`;

    // Criar Blob e baixar o arquivo
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const nomeArquivo = `${cliente}_${os}.html`;

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
}

// Evento para baixar o checklist com imagens
document.getElementById('gerarChecklist').addEventListener('click', baixarChecklistComoHTML);
