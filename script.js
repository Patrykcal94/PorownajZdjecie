document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imageContainer = document.getElementById('imageContainer');
    const comparisonContainer = document.getElementById('comparisonContainer');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const refreshBtn = document.getElementById('refreshBtn');

    let selectedImages = [];

    imageUpload.addEventListener('change', () => {
        const files = imageUpload.files;
        if (files.length + imageContainer.childElementCount > 15) {
            alert('You can only upload up to 15 images.');
            return;
        }
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('draggable');
                img.dataset.index = imageContainer.childElementCount;
                img.draggable = true;
                img.addEventListener('click', () => selectImage(img));
                img.addEventListener('dragstart', dragStart);
                img.addEventListener('dragover', dragOver);
                img.addEventListener('drop', drop);
                img.addEventListener('dragend', dragEnd);
                img.addEventListener('dragleave', dragLeave);
                imageContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    function selectImage(img) {
        if (selectedImages.length < 2 && !img.classList.contains('selected')) {
            img.classList.add('selected');
            selectedImages.push(img);
        } else if (img.classList.contains('selected')) {
            img.classList.remove('selected');
            selectedImages = selectedImages.filter(selectedImg => selectedImg !== img);
        }

        if (selectedImages.length === 2) {
            comparisonContainer.classList.remove('hidden');
            image1.src = selectedImages[0].src;
            image2.src = selectedImages[1].src;
        } else {
            comparisonContainer.classList.add('hidden');
        }
    }

    refreshBtn.addEventListener('click', () => {
        selectedImages.forEach(img => img.classList.remove('selected'));
        selectedImages = [];
        comparisonContainer.classList.add('hidden');
        image1.src = '';
        image2.src = '';
    });

    function dragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
    }

    function dragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        e.target.classList.remove('drag-over');
        if (e.target.classList.contains('draggable')) {
            const elements = [...imageContainer.children];
            const currentIndex = elements.indexOf(e.target);
            const draggingIndex = elements.indexOf(draggingElement);

            if (currentIndex !== draggingIndex) {
                imageContainer.insertBefore(draggingElement, draggingIndex < currentIndex ? e.target.nextSibling : e.target);
            }
        }
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }
});
