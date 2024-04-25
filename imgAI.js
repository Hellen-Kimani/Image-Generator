const generateForm = document.querySelector('.generate-form');
const imageGallery = document.querySelector('.image-gallery');

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll('.image-card')[index];//the image card
        const imgElement = imgCard.querySelector('img');//the image element itself
        const downloadBtn = imgCard.querySelector('.download-btn');//the downlad button image

        //set the image source to the ai generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        //when the image is loaded remove the loading class and set download attributes
        imgElement.onload = () => {
            imgCard.classList.remove('loading');
            downloadBtn.setAttribute('href', aiGeneratedImg);
            downloadBtn.setAttribute('download', `${new Date().getTime()}.jpg`);

        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try{
        //send a request to OpenAI to generate images based on user inputs
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: '512x512',
                response_format: 'b64_json'
            })
        });

        if(!response.ok) throw new Error ('failed to generate images please try again');
        console.log (response);
        const {data} = await response.json();//get data from the reponse
        updateImageCard([...data]);
    } catch(error) {
        alert(error.message);
    }
}
const handleFormSubmission= (e) => {
    e.preventDefault();

    //get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () => 
        `<div class="image-card loading">
            <img src="src file/Cartoon Snail Loading Loading Gif Animation PNG Images _ PSD Free Download - Pikbest (1).gif" alt="image">
            <a href="#" class="download-btn">
                <img src="src file/cdcb7dfc-8671-42de-872e-cb1cb0504830.jpeg" alt="download icon">
            </a>
        </div>`
    ).join('');

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}
generateForm.addEventListener('submit', handleFormSubmission);