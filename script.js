document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imageContainer = document.getElementById('imageContainer');
    const comparisonContainer = document.getElementById('comparisonContainer');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const refreshBtn = document.getElementById('refreshBtn');

    let selectedImages = [];
    let draggingElement = null;
    let placeholder = document.createElement('div');
    placeholder.className = 'placeholder';

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
                img.addEventListener('click', (event) => {
                    event.stopPropagation();
                    selectImage(img);
                });
                addDragAndDropEvents(img);
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

    function addDragAndDropEvents(img) {
        img.addEventListener('dragstart', dragStart);
        img.addEventListener('dragover', dragOver);
        img.addEventListener('drop', drop);
        img.addEventListener('dragend', dragEnd);
        img.addEventListener('dragleave', dragLeave);
        
        img.addEventListener('touchstart', touchStart);
        img.addEventListener('touchmove', touchMove);
        img.addEventListener('touchend', touchEnd);
    }

    function dragStart(e) {
        draggingElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        imageContainer.insertBefore(placeholder, e.target.nextSibling);
    }

    function dragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains('draggable')) {
            const bounding = e.target.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            const afterElement = (e.clientY - offset > 0) ? e.target.nextSibling : e.target;
            imageContainer.insertBefore(placeholder, afterElement);
        }
    }

    function drop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        if (e.target.classList.contains('draggable')) {
            imageContainer.insertBefore(draggingElement, placeholder);
        }
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
        draggingElement = null;
        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }
    }

    function touchStart(e) {
        draggingElement = e.target;
        e.target.classList.add('dragging');
        placeholder.style.height = `${e.target.clientHeight}px`;
        imageContainer.insertBefore(placeholder, e.target.nextSibling);
        e.preventDefault();
    }

    function touchMove(e) {
        const touchLocation = e.targetTouches[0];
        const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
        if (element && element.classList.contains('draggable')) {
            const bounding = element.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            const afterElement = (touchLocation.clientY - offset > 0) ? element.nextSibling : element;
            imageContainer.insertBefore(placeholder, afterElement);
        }
        e.preventDefault();
    }

    function touchEnd(e) {
        if (placeholder.parentNode) {
            imageContainer.insertBefore(draggingElement, placeholder);
            placeholder.parentNode.removeChild(placeholder);
        }
        e.target.classList.remove('dragging');
        draggingElement = null;
    }
});
