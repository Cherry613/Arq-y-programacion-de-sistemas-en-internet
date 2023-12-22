// The GraphQL schema
export const typeDefs = `#graphql
  type Cliente {
    name: String!
    email: String!
    cards: [Tarjeta]!   #! dentro -> el array tiene q tener minimo un elemento,  ! fuera -> array puede estar vacio,  ! dos -> array existe y minimo tendra un elemento
    travels: [ID]!
  }

  type Conductor {
    name: String!
    email: String!
    username: String!
    travels: [ID]!
  }

  type Viaje {
    client: ID!
    driver: ID!
    money: Int!
    distance: Int!
    date: String!
    status: String!
  }

   type Tarjeta {
    number: String!
    cvv: Int!
    expirity: String!
    money: Int!
  }

  type Query {
    clientes: [Cliente!]!
    conductores: [Conductor!]!
    viajes: [Viaje!]!
  }
  type Mutation {
    addCliente( name: String!, email: String!): Cliente!
    addConductor( name: String!, email: String!, username: String!): Conductor!
    addViaje(client: ID!, driver: ID!, money: Int!, distance: Int!, date: String!): Viaje!
    
    deleteCliente(id: ID!): String! #string que dice q hemos borrado
    deleteDriver(id: ID!): String!  #string que dice q hemos borrado
    deleteTarjetaFromCliente(id_tarjeta: ID!, id_cliente: ID!): String!  #string que dice q hemos borrado

    tarjetaCliente(id: ID!, name: String!): String!    #update de añadir una tarjeta al cliente  -> devolver string de q acabo 
    terminarViaje(id: ID!): String! #update del estado del viaje y borrar el viaje  -> devolver string de q acabo
  }
`;
