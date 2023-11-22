# Arq-y-programacion-de-sistemas-en-internet

## Endpoints de la práctica 3:

-  .post ("/cliente", addCliente) 
    - Sirve para crear un nuevo cliente con los parámetros dni (string), nombre (string), dinero (number), id_gestor (string), hipotecas (array de string, para guardar todas las hipotecas que tenga el cliente), movimientos (array de string, para guardar los movimientos que ha tenido el cliente).
    - En el body habrá que añadir obligatoriamente el dni y el nombre, el dinero se pondrá por defecto a 0 en caso de no ser añadido, el id_gestor se inicializará como un string vacio, hipotecas y movimientos no hay que añadirlos. 
-  .delete("/cliente/:_id", deleteCliente)
    -  Sirve para borrar un cliente, se deberá de pasar el id del cliente y en caso de que este no tenga hipotecas por pagar se eliminará.  
-  .put("/cliente/:id1/:id2", enviar_dinero)
    - Sirve para enviar dinero de un cliente a otro, necesita los ids de dos clientes, el primero mandará el dinero al segundo.
    - En el body habrá que incluir la cantidad de dinero que queremos enviar de un cliente a otro.
-  .put("/cliente/:id", ingresar_dinero)
    - Ingresa dinero en la cuenta del cliente que indiquemos por la url.
    - En el body se especificará la cantidad de dinero que queramos ingresar, se comprobará que no sea ni negativa ni igual a 0.
-  .post("/hipoteca", addHipoteca)
    - Crea una nueva hipoteca con los parámetros importe_total (number), cuotas (number), id_cliente (string), id_gestor (string).
    - En el body habrá que añadir obligatoriamente el importe_total y el id del cliente al que le vamos a añadir la hipoteca, el id del gestor se cogerá a través del cliente ya que es necesario que este tenga un gestor para poder añadirle una hipoteca, las cuotas de la hipoteca siempre serán 20.
-  .put("/hipoteca/:id_hipoteca", amortizar)
    - Se realiza el pago de una de las cuotas de la hipoteca que indiquemos por la url.
-  .post("/gestor", addGestor)
    - Sirve para crear un nuevo gestor con los parámetros nombre (string), dni (string), clientes (array de string que contendrá los id de los clientes que gestione el gestor, como máximo podrá gestionar hasta 10 clientes).
    - En el body habrá que incluir el nombre y el dni del gestor.
-  .put("/asignar/:_id", asignar_gestor)
  - Sirve para asignar clientes a un gestor, la url indicará el cliente que queramos añadir, en el body se incluirá el id del gestor, comprobaremos que ambos existen y que el gestor no tenga aún 10 clientes, después se actualizarán tanto el cliente como el gestor.
### Apartados extra
- ingresar_tiempo, que ingresa a todos los clientes del banco 10.000€ cada 5 minutos.
- amortizar_tiempo, cada 5 minutos cobra una cuota de todas las hipotecas que existan en la base de datos.
## Types
- Esta práctica tiene 3 tipos de datos distintos: Cliente, Hipoteca y Gestor. Además cada uno tendrá su correspondiente esquema para la base de datos.
