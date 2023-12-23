// The GraphQL schema
export const typeDefs = `#graphql
  type Cliente {
    name: String!
    email: String!
    cards: [Tarjeta]! 
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
    addCliente( name: String!, email: String!): String!
    addConductor( name: String!, email: String!, username: String!): String!
    addViaje(client: ID!, driver: ID!, money: Int!, distance: Int!, date: String!): String!
    
    deleteCliente(id: ID!): String!
    deleteDriver(id: ID!): String!
    deleteTarjeta(num_tarjeta: String!, id_cliente: ID!): String! 

    addTarjeta(id_cliente: ID!, number: String!, cvv: Int!, expirity: String!, money: Int!): String! 
    terminarViaje(id: ID!): String! 
  }
`;
