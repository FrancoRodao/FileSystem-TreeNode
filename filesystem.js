const types = {
	folder: "FOLDER",
	file: "FILE"
}

//TODO: RENAME FILES AND FOLDERS

class SystemTreeNode {
	constructor(rootNode) {
		this.root = rootNode
	}

	addFile(path, fileName) {
		let fileExt = fileName.split(".")
		fileExt = fileExt.length === 1 ? "" : fileExt[fileExt.length - 1]

		const fileFullName = `${fileName}.${fileExt}`

		//crear las carpetas que no existen en el path
		const { lastNodeCreated } = this.recreatePath(path)

		//añadir el archvio
		const existsFile = this.findInNode(
			lastNodeCreated,
			fileFullName,
			types.file
		)

		if (existsFile.node) {
			return console.log("ya existe el archivo", fileFullName)
		}

		lastNodeCreated.children.push(new SystemFile(fileName, fileExt, path))
	}

	addFolder(path, folderName) {
		//crear las carpetas que no existen en el path
		const { lastNodeCreated } = this.recreatePath(path + folderName)

		const existsFolder = this.findInNode(
			lastNodeCreated,
			folderName,
			types.folder
		)

		if (existsFolder.node) {
			return console.log("ya existe la carpeta", folderName)
		}

		lastNodeCreated.children.push(new SystemFolder(null, folderName, path))
	}

	recreatePath(path) {
		const pathSplitted = path.split("/")
		const folders = pathSplitted.slice(1, -1)

		let recreatedPath = ""
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
		}

		return {
			lastNodeCreated: searchingIn,
			recreatedPath
		}
	}

	findInNode(node, nameToSearch, type) {
		if (!Object.values(types).includes(type)) {
			throw new Error(
				`Tipo invalido. Utiliza los tipos de la constante types.
				 Los tipos validos son: ${Object.values(types)}`
			)
		}

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

		//no encontrado
		return {
			node: null,
			index: -1
		}
	}
}

class SystemFolder {
	constructor(children, title, path) {
		this.children = children || []
		this.title = title
		this.path = path
		this.type = types.folder
	}
}

class SystemFile {
	constructor(title, extension, path) {
		this.title = title
		this.extension = extension
		this.path = path
		this.type = types.file
	}
}

const rootNodeOfFolder = new SystemFolder(null, "root", "/")

const treeNodeFolder = new SystemTreeNode(rootNodeOfFolder)

export { treeNodeFolder }
