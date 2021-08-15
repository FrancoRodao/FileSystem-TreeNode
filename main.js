import { treeNodeFolder, types } from "./filesystem.js"

window.addEventListener("click", e => unSelectFile())

/* VISOR */
const visor = document.querySelector(".visor")
const intialPath = treeNodeFolder.root.path
visor.textContent = intialPath
const getVisorPath = () => visor.textContent

/* BUTTONS */
const addFolderBtn = document.querySelector(".btn-add-folder")
const addFileBtn = document.querySelector(".btn-add-file")
const backBtn = document.querySelector(".btn-back")
const deleteBtn = document.querySelector(".btn-delete-file")

addFolderBtn.addEventListener("click", e => {
	const folderName = prompt("Nombre de la nueva carpeta")
	if (!folderName) return
	treeNodeFolder.addFolder(getVisorPath(), folderName)
	render()
})

addFileBtn.addEventListener("click", e => {
	const fileName = prompt("Nombre del archivo nuevo")
	if (!fileName) return
	treeNodeFolder.addFile(getVisorPath(), fileName)
	render()
})

backBtn.addEventListener("click", e => {
	if (getVisorPath() === intialPath) return

	const aux = getVisorPath().split("/")
	visor.textContent =
		aux[aux.length - 2] === "" ? "/" : aux.slice(0, -1).join("/")
	render()
})

deleteBtn.addEventListener("click", e => {
	const selectedFile = getSelectedFile()
	if (!selectedFile) {
		console.log("no hay archivos selecionados")
		return
	}
	const fileName = selectedFile.childNodes[0].dataset.title
	treeNodeFolder.deleteFile(getVisorPath(), fileName)
})

/* RENDERS */
const container = document.querySelector(".container")
const clearContainer = () => (container.textContent = "")

function openFile({ target }) {
	switch (target.dataset.type) {
		case types.folder:
			visor.textContent +=
				visor.textContent === intialPath
					? `${target.dataset.title}`
					: `/${target.dataset.title}`
			render()
			break

		default:
			break
	}
}

function unSelectFile() {
	const actualSelectedFile = document.querySelector(".file-active")
	if (actualSelectedFile) {
		actualSelectedFile.classList.remove("file-active")
	}
}

function selectFile(event) {
	event.stopPropagation()
	unSelectFile()
	event.currentTarget.classList.add("file-active")
}

const getSelectedFile = () => document.querySelector(".file-active")

function render() {
	clearContainer()
	const nodeToRender = treeNodeFolder.getNodeByPath(getVisorPath())

	nodeToRender.children.forEach(child => {
		const div = document.createElement("div")
		div.classList.add("file-container", child.type)
		div.insertAdjacentHTML(
			"afterbegin",
			`<div data-title='${child.title}' data-type=${child.type}>${
				child.title
			}</div>
			${
				child.type === types.file &&
				`<span class="file-ext">${child.extension}</span>`
			}`
		)

		div.addEventListener("click", openFile)
		div.addEventListener("click", selectFile)
		container.append(div)
	})
}

render()
