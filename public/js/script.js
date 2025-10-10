
const modal = document.getElementById("myModal");
const modal2 = document.getElementById("myModal2");
const modal3 = document.getElementById("myModal3");
const newFolder = document.getElementById("newFolder");
const closeBtn = document.getElementById("closeModalBtn");
const closeBtn2 = document.getElementById("closeModalBtn2");
const editDelete = document.querySelectorAll(".edit-delete");
const editDeleteContainer = document.querySelectorAll(".edit-delete-container");
const editBtn = document.querySelectorAll("#edit");
const editBtn2 = document.querySelectorAll("#edit2");

// Open modal
newFolder.onclick = function() {
    modal.style.display = "block";
    newFolder.style.display = "none";
}

// Close modal for creating a folder
closeBtn.onclick = function() {
    modal.style.display = "none";
    newFolder.style.display = "block";
}

// Close modal if clicking outside of it
window.onclick = function(event) {
    if (event.target === modal) {
    modal.style.display = "none";
    newFolder.style.display = "block";
    }
    if (event.target === modal2) {
    modal2.style.display = "none";
    }
}

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
    })
});
//Adding action listener for the edit button of a file
editBtn2.forEach((item) => {
    item.addEventListener('click', async  (e) => {
    modal3.style.display = "block";
    })
});

// Close modal for editing a folder
closeBtn2.onclick = function() {
    modal2.style.display = "none";
}

// For viewing file details
document.addEventListener("DOMContentLoaded", () => {
    const fileContainer = document.querySelectorAll(".file-container");
    const fileName = document.querySelector(".file-name");
    const fileDate = document.querySelector(".file-date");
    const fileType = document.querySelector(".file-type");
    const fileInfo = document.querySelector(".file-info");
    const fileId = document.querySelector("#file-id-download");
    const downloadForm = document.querySelector("#download-form");

    fileContainer.forEach((item) => {
        item.addEventListener('click', async (e) => {
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
        })
    })
})

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
    const editButtons = document.querySelectorAll(".edit-file-btn");
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