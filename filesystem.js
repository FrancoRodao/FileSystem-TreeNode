const types = {
	folder: "FOLDER",
	file: "FILE"
}

class SystemTreeNode {
	constructor() {
		this.root = new SystemFolder(null, "", "/")
	}

	getFullPath(path, name) {
		return `${path === this.root.path ? path : path + "/"}${name}`
	}

	addFile(path, fileName) {
		//TODO: INTENTAR SACAR ESTA RESTRICION USANDO RECREATE PATH CREAR LA CARPETA DIRECTAMENTE
		if (fileName.includes("/")) {
			return console.error("el archivo no puede contener /")
		}
		if (!fileName) return console.error("el archivo debe tener nombre")

		let fileExt = SystemFile.getExtensionOfFileName(fileName)
		const fullPath = this.getFullPath(path, fileName)

		//crear las carpetas que no existen en el path
		const { lastNodeCreated } = this.recreatePath(fullPath)

		//añadir el archvio
		const existsFile = this.findInNode(lastNodeCreated, fileName, types.file)

		if (existsFile.node) {
			return console.log("ya existe el archivo", fileName)
		}

		lastNodeCreated.children.push(new SystemFile(fileName, fileExt, fullPath))
	}

	delete(path, type, name) {
		this.checkIsValidType(type)

		const node = this.getNodeByPath(path)
		const file = this.findInNode(node, name, type)
		node.children.splice(file.index, 1)
	}

	addFolder(path, folderName) {
		//TODO: INTENTAR SACAR ESTA RESTRICION USANDO RECREATE PATH CREAR LA CARPETA DIRECTAMENTE
		if (folderName.includes("/")) {
			return console.error("el archivo no puede contener /")
		}
		if (!folderName) return console.error("el archivo debe tener nombre")

		const fullPath = this.getFullPath(path, folderName)

		//crear las carpetas que no existen en el path
		const { lastNodeCreated } = this.recreatePath(fullPath)

		const existsFolder = this.findInNode(
			lastNodeCreated,
			folderName,
			types.folder
		)

		if (existsFolder.node) {
			return console.log("ya existe la carpeta", folderName)
		}

		lastNodeCreated.children.push(new SystemFolder(null, folderName, fullPath))
	}

	rename(path, type, name, newName) {
		if (name === newName) return

		const node = this.getNodeByPath(path)
		const file = this.findInNode(node, name, type)
		console.log(path, type, name, newName, file)
		file.node.rename(newName)
	}

	recreatePath(path) {
		const pathSplitted = path.split("/")
		const folders = pathSplitted.slice(1, -1)

		let recreatedPath = this.root.path
		let searchingIn = this.root

		for (let index = 0; index < folders.length; index++) {
			const folderName = folders[index]
			const currentFolder = this.findInNode(
				searchingIn,
				folderName,
				types.folder
			)
			recreatedPath += `/${folderName}`

			//la carpeta ya existe
			if (currentFolder.node) {
				searchingIn = searchingIn.children[currentFolder.index]
				continue
			}

			//agregar la carpeta al nodo
			const length = searchingIn.children.push(
				new SystemFolder(null, folderName, recreatedPath)
			)
			//empezar a buscar en la nueva carpeta agregada
			searchingIn = searchingIn.children[length - 1]
			console.log(searchingIn)
		}

		return {
			lastNodeCreated: searchingIn,
			recreatedPath
		}
	}

	getNodeByPath(path) {
		if (path === "/") return this.root

		const pathSplitted = path.split("/")
		const folders = pathSplitted.slice(1)

		let searchingIn = this.root

		for (let index = 0; index < folders.length; index++) {
			const folderName = folders[index]
			const currentFolder = this.findInNode(
				searchingIn,
				folderName,
				types.folder
			)

			searchingIn = searchingIn.children[currentFolder.index]
		}
		return searchingIn
	}

	findInNode(node, nameToSearch, type) {
		this.checkIsValidType(type)

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i]
			if (child.path.split("/").includes(nameToSearch) && child.type === type) {
				return {
					node: child,
					index: i
				}
			}

			continue
		}

		//not founded
		return {
			node: null,
			index: -1
		}
	}

	checkIsValidType(type) {
		if (!Object.values(types).includes(type)) {
			throw new Error(
				`Tipo invalido. Utiliza los tipos de la constante types.
				 Los tipos validos son: ${Object.values(types)}`
			)
		}
	}
}

//TODO: create abstract class
class SystemFolder {
	constructor(children, title, path) {
		this.children = children || []
		this.title = title
		this.path = path
		this.type = types.folder
	}

	rename(newName) {
		const pathSplitted = this.path.split("/")
		//replace name in path
		pathSplitted[pathSplitted.length - 1] = newName

		this.path = pathSplitted.join("/")
		this.title = newName
	}
}

class SystemFile {
	constructor(title, extension, path) {
		this.title = title
		this.extension = extension === "" ? "No extension" : extension
		this.path = path
		this.type = types.file
	}

	rename(newName) {
		const pathSplitted = this.path.split("/")
		//replace name in path
		pathSplitted[pathSplitted.length - 1] = newName

		this.path = pathSplitted.join("/")
		this.title = newName
		this.extension = SystemFile.getExtensionOfFileName(newName)
	}

	static getExtensionOfFileName(fileName) {
		let fileExt = fileName.split(".")
		fileExt = fileExt.length === 1 ? "" : fileExt[fileExt.length - 1]
		return fileExt
	}
}

const treeNodeFolder = new SystemTreeNode()

export { treeNodeFolder, types }
