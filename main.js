import { treeNodeFolder, types } from "./filesystem.js"

window.addEventListener("click", e => unSelectFile())

/* VISOR */
const visor = document.querySelector(".visor")
const intialPath = treeNodeFolder.root.path
visor.textContent = intialPath
const visorPath = () => visor.textContent

/* BUTTONS */
const addFolderBtn = document.querySelector(".btn-add-folder")
const addFileBtn = document.querySelector(".btn-add-file")
const backBtn = document.querySelector(".btn-back")

addFolderBtn.addEventListener("click", e => {
	const folderName = prompt("Nombre de la nueva carpeta")
	if (!folderName) return
	treeNodeFolder.addFolder(visorPath(), folderName)
	render()
})

addFileBtn.addEventListener("click", e => {
	const fileName = prompt("Nombre del archivo nuevo")
	if (!fileName) return
	treeNodeFolder.addFile(visorPath(), fileName)
	render()
})

backBtn.addEventListener("click", e => {
	if (visorPath() === intialPath) return

	const aux = visorPath().split("/")
	visor.textContent =
		aux[aux.length - 2] === "" ? "/" : aux.slice(0, -1).join("/")
	render()
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

function render() {
	clearContainer()
	const nodeToRender = treeNodeFolder.getNodesByPath(visorPath())

	nodeToRender.children.forEach(child => {
		const div = document.createElement("div")
		div.insertAdjacentHTML(
			"afterbegin",
			`<div class='${child.type}' data-title='${child.title}' data-type=${child.type}>${child.title}</div>`
		)
		div.addEventListener("click", openFile)
		container.append(div)
	})

	const allFiles = document.querySelectorAll(`.${types.file}`)
	allFiles.forEach(fileNode => {
		fileNode.addEventListener("click", e => {
			e.stopPropagation()
			unSelectFile()
			e.target.classList.add("file-active")
		})
	})

	console.log(treeNodeFolder)
}

render()
