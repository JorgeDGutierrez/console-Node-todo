require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const {
	inquirerMenu,
	pausa,
	leerInput,
	listadoTareasBorrar,
	confirmar,
	mostrarListadoCheckList
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');

const main = async () => {
	let opt = '';

	const tareas = new Tareas();

	const tareasDB = leerDB();

	if (tareasDB) {
		//cargar tareas
		//Establecer las tareas
		//TODO: cargarTareas
		tareas.cargarTareasFromArray(tareasDB);
	}

	do {
		//imprimir el menu
		opt = await inquirerMenu();

		switch (opt) {
			case '1':
				const desc = await leerInput('Descripcion: ');
				tareas.crearTarea(desc);
				break;
			case '2':
				tareas.ListadoCompleto();
				//console.log(tareas.listadoArr);
				break;
			case '3':
				tareas.ListarPendientesCompletadas(true);
				break;
			case '4':
				tareas.ListarPendientesCompletadas(false);
				break;
			case '5':
				const ids = await mostrarListadoCheckList(tareas.listadoArr);
				tareas.toggleCompletadas(ids);
				break;
			case '6':
				const id = await listadoTareasBorrar(tareas.listadoArr);
				if (id !== '0') {
					const ok = await confirmar('Estas seguro?');
					if (ok) {
						tareas.borrarTarea(id);
						console.log('Tarea borrada correctamente');
					}
				}

				break;

				// TODO preguntar si estas seguro
				console.log({ ok });
		}

		guardarDB(tareas.listadoArr);

		if (opt !== '0') await pausa();
	} while (opt !== '0');

	//pausa();
};

main();
