import { treeNodeFolder, types } from "./filesystem.js"

window.addEventListener("click", e => {
	unSelectFiles()
	if (
		e.target.classList.contains("file-container") ||
		e.target.dataset.type === types.folder ||
		e.target.dataset.type === types.file
	) {
		selectFile(e.target)
	}
	contextMenu.style.display = "none"
})

//open files (folders and files) on dblclick
window.addEventListener("dblclick", e => {
	if (
		e.target.classList.contains("file-container") ||
		e.target.dataset.type === types.folder ||
		e.target.dataset.type === types.file
	) {
		openFileHandler(e)
	}
})

/* CONTEXT MENU */
const contextMenu = document.querySelector(".context-menu")
const cxtMenuNewFolder = document.querySelector(".cxt-newfolder")
const cxtMenuNewFile = document.querySelector(".cxt-newfile")
const cxtMenuOpen = document.querySelector(".cxt-open")
const cxtMenuDelete = document.querySelector(".cxt-delete")

//open context menu
let cxtMenuOpenHandler = null
let cxtMenuRemoveHandler = null
window.addEventListener("contextmenu", e => {
	e.preventDefault()
	contextMenu.style.top = `${e.clientY - 15}px`
	contextMenu.style.left = `${e.clientX}px`
	contextMenu.style.display = "flex"
	cxtMenuOpen.style.display = "none"
	cxtMenuDelete.style.display = "none"

	if (
		e.target.classList.contains("file-container") ||
		e.target.dataset.type === types.folder ||
		e.target.dataset.type === types.file
	) {
		cxtMenuOpen.style.display = "block"
		cxtMenuDelete.style.display = "block"

		cxtMenuOpen.removeEventListener("click", cxtMenuOpenHandler)
		cxtMenuOpenHandler = () => openFileHandler(e)
		cxtMenuOpen.addEventListener("click", cxtMenuOpenHandler)

		cxtMenuDelete.removeEventListener("click", cxtMenuRemoveHandler)
		cxtMenuRemoveHandler = () => removeFileHandler(e)
		cxtMenuDelete.addEventListener("click", cxtMenuRemoveHandler)
	}
})

cxtMenuNewFolder.addEventListener("click", e => {
	const folderName = prompt("Folder name")
	if (!folderName) return
	treeNodeFolder.addFolder(getVisorPath(), folderName)
	render()
})

cxtMenuNewFile.addEventListener("click", e => {
	const fileName = prompt("File name")
	if (!fileName) return
	treeNodeFolder.addFile(getVisorPath(), fileName)
	render()
})

/* VISOR */
const visor = document.querySelector(".visor")
const intialPath = treeNodeFolder.root.path
visor.textContent = intialPath
const getVisorPath = () => visor.textContent

/* Back button */
const backBtn = document.querySelector(".btn-back")
backBtn.addEventListener("click", e => {
	if (getVisorPath() === intialPath) return

	const aux = getVisorPath().split("/")
	visor.textContent =
		aux[aux.length - 2] === "" ? "/" : aux.slice(0, -1).join("/")
	render()
})

/* RENDERS */
const container = document.querySelector(".container")
const clearContainer = () => (container.textContent = "")

function openFileHandler({ target }) {
	const openFile = ({ type, title }) => {
		switch (type) {
			case types.folder:
				visor.textContent +=
					visor.textContent === intialPath ? `${title}` : `/${title}`
				break

			case types.file:
				console.log("not implemented")

			default:
				break
		}
	}

	//click on file-container
	if (target.classList.contains("file-container")) {
		openFile(target.firstChild.dataset)
	}
	/*
	click on file (child of file-container see how the files 
				   are rendered in the render function)
	*/
	if (target.dataset.type) openFile(target.dataset)

	render()
}

function removeFileHandler({ target }) {
	//click on file-container
	if (target.classList.contains("file-container")) {
		const { type, title } = target.firstChild.dataset
		treeNodeFolder.deleteFile(getVisorPath(), type, title)
	}

	if (
		target.dataset.type === types.folder ||
		target.dataset.type === types.file
	) {
		treeNodeFolder.deleteFile(
			getVisorPath(),
			target.dataset.type,
			target.dataset.title
		)
	}
	render()
}

function unSelectFiles() {
	const actualSelectedFile = document.querySelector(".file-active")
	if (actualSelectedFile) {
		actualSelectedFile.classList.remove("file-active")
	}
}

function selectFile(HTMLElement) {
	unSelectFiles()
	if (!HTMLElement.classList.contains("file-container")) {
		HTMLElement.parentElement.classList.add("file-active")
		return
	}

	HTMLElement.classList.add("file-active")
}

function render() {
	clearContainer()
	const nodeToRender = treeNodeFolder.getNodeByPath(getVisorPath())

	nodeToRender.children.forEach(child => {
		const fileContainer = document.createElement("div")
		fileContainer.classList.add("file-container", child.type)

		const file = document.createElement("div")
		file.dataset.title = child.title
		file.dataset.type = child.type
		file.textContent = child.title
		fileContainer.append(file)

		if (child.type === types.file) {
			const extensionSpan = document.createElement("span")
			extensionSpan.classList.add("file-ext")
			extensionSpan.textContent = child.extension
			fileContainer.append(extensionSpan)
		}

		container.append(fileContainer)
	})
}

render()
