import { treeNodeFolder, types } from "./filesystem.js"

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
	console.log(visorPath())
	treeNodeFolder.addFolder(visorPath(), folderName)
	render()
})

addFileBtn.addEventListener("click", e => {
	const fileName = prompt("Nombre del archivo nuevo")
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
			clearContainer()
			render()
			break

		default:
			break
	}
}

function render() {
	clearContainer()
	const nodeToRender = treeNodeFolder.getNodesByPath(visorPath())

	nodeToRender.children.forEach(child => {
		const div = document.createElement("div")
		div.insertAdjacentHTML(
			"afterbegin",
			`<div data-title='${child.title}' data-type=${child.type}>${child.title}</div>`
		)
		div.addEventListener("click", openFile)
		container.append(div)
	})
}

render()

console.log(treeNodeFolder)
