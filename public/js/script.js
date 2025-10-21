
const modal = document.getElementById("myModal");
const fileModal = document.querySelector(".file-modal");
const modal2 = document.getElementById("myModal2");
const modal3 = document.getElementById("myModal3");
const newFolder = document.getElementById("newFolder");
const newFile = document.getElementById("newFile");
const closeBtn = document.getElementById("closeModalBtn");
const closeFileBtn = document.getElementById("closeFileModalBtn");
const closeBtn2 = document.getElementById("closeModalBtn2");
const closeBtn3 = document.getElementById("closeModalBtn3");
const editDelete = document.querySelectorAll(".edit-delete");
const editDeleteContainer = document.querySelectorAll(".edit-delete-container");
const editBtn = document.querySelectorAll("#edit");
const editBtn2 = document.querySelectorAll("#edit2");
const mainPage = document.getElementById("folders-page-container");
const closeFileInfo = document.getElementById("closeFileInfo");

// Open modal for creating a new folder
newFolder.onclick = function() {
    modal.style.display = "block";
    mainPage.classList.add("bluer");
}

//Open modal for adding a new file
newFile.onclick = function() {
    fileModal.style.display = "block";
}

// Close modal for creating a folder
closeBtn.onclick = function() {
    modal.style.display = "none";
    mainPage.classList.remove("bluer");
}

// Close modal for adding a file
closeFileBtn.onclick = function() {
    fileModal.style.display = "none";
    mainPage.classList.remove("bluer");
}

// Close modal if clicking outside of it
window.onclick = function(e) {
    const clickedInsideEditButton = Array.from(editBtn).some( item => item.contains(e.target));
    const clickedInsideEditButton2 = Array.from(editBtn2).some( item => item.contains(e.target));
    if(!modal.contains(e.target) && modal.style.display === "block" && e.target !== newFolder){
        modal.style.display = "none";
        mainPage.classList.remove("bluer");
    }
    if(!fileModal.contains(e.target) && fileModal.style.display === "block" && e.target !== newFile){
        fileModal.style.display = "none";
        mainPage.classList.remove("bluer");
    }
    if(!modal2.contains(e.target) && modal2.style.display === "block" && !clickedInsideEditButton){
        modal2.style.display = "none";
        mainPage.classList.remove("bluer");
    }
    if(!modal3.contains(e.target)&& modal3.style.display === "block" && !clickedInsideEditButton2){
        modal3.style.display = "none";
        mainPage.classList.remove("bluer");
    }
}


//Used for closing the edit delete buttons after a user clicks outside of its container
document.addEventListener("DOMContentLoaded", () => {
    
    document.addEventListener('click', (e) => {
        const clickedInsideEditDelete = Array.from(editDelete).some( item => item.contains(e.target));
        const clickedInsideEditDeleteContainer = Array.from(editDeleteContainer).some( item => item.contains(e.target));
        if(!clickedInsideEditDelete && !clickedInsideEditDeleteContainer){
            editDeleteContainer.forEach(item => item.style.display = "none");
        }
    })
});

//Open edit and delete options
editDelete.forEach(item => {
    item.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const editDeleteItemContainer = document.getElementById(`${id}`);
        if(window.getComputedStyle(editDeleteItemContainer).display === "none"){
            editDeleteItemContainer.style.display = "block";
        }else{
            editDeleteItemContainer.style.display = "none";
        }
    })
});

//Adding action listener for the edit button of a folder

editBtn.forEach((item) => {
    item.addEventListener('click', async  (e) => {
    modal2.style.display = "block";
    mainPage.classList.add("bluer");
    })
});
//Adding action listener for the edit button of a file
editBtn2.forEach((item) => {
    item.addEventListener('click', async  (e) => {
    modal3.style.display = "block";
    mainPage.classList.add("bluer");
    })
});

// Close modal for editing a folder
closeBtn2.onclick = function() {
    modal2.style.display = "none";
}

// Close modal for editing a folder
closeBtn3.onclick = function() {
    modal3.style.display = "none";
}

// For viewing file details
document.addEventListener("DOMContentLoaded", () => {
    const fileDetail = document.querySelectorAll(".file-container");
    const fileName = document.querySelector(".file-name");
    const fileDate = document.querySelector(".file-date");
    const fileType = document.querySelector(".file-type");
    const fileInfo = document.querySelector(".file-info");
    const fileId = document.querySelector("#file-id-download");
    const downloadForm = document.querySelector("#download-form");

    fileDetail.forEach((item) => {
        item.addEventListener('click', async (e) => {
            const clickedInsideEditDelete = Array.from(editDelete).some( item => item.contains(e.target));
            if( !clickedInsideEditDelete ){
                fileInfo.style.display = "block";
                const name = item.getAttribute("data-name");
                const date = item.getAttribute("data-date");
                const type = item.getAttribute("data-type");
                const id = item.id;

                fileName.textContent = name;
                fileDate.textContent = date.toString().replace(/ GMT.*/, '');
                fileType.textContent = type;
                fileId.id = id;
                downloadForm.action = `/download/${id}`;//We are giving an action for the form based on the id of the item clicked
            }
        })
    })
});

// Close file details modal
closeFileInfo.onclick = function(){
    const fileInfo = document.querySelector(".file-info");
    fileInfo.style.display = "none";
}

// Used for editing the name of the folder for passing the folder name into the input field of the modal for editing
document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    const folderParentIdInput = document.getElementById("editFolderParentId");
    const folderNameInput = document.getElementById("editFolderName");
    const folderIdInput = document.getElementById("editFolderId");

    editButtons.forEach(button => {
      button.addEventListener("click", () => {
        const folderId = button.getAttribute("data-id");
        const folderName = button.getAttribute("data-name");
        const folderParentId = button.getAttribute("data-parent-id");

        // Pre-fill modal inputs
        folderParentIdInput.value = folderParentId;
        folderNameInput.value = folderName;
        folderIdInput.value = folderId;
      });
    });
  });
// Used for editing the name of the file for passing the folder name into the input field of the modal for editing
  document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll("#edit2");
    const fileParentIdInput = document.getElementById("editFileParentId");
    const fileNameInput = document.getElementById("editFileName");
    const fileIdInput = document.getElementById("editFileId");

    editButtons.forEach(button => {
      button.addEventListener("click", () => {
        const folderId = button.getAttribute("data-id");
        const folderName = button.getAttribute("data-name");
        const folderParentId = button.getAttribute("data-parent-id");

        // Pre-fill modal inputs
        fileParentIdInput.value = folderParentId;
        fileNameInput.value = folderName;
        fileIdInput.value = folderId;
      });
    });
  });