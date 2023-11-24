import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { Pet } from "./types.ts";
import PetModel from "./db/pet.ts";

// The GraphQL schema
const typeDefs = `#graphql
  type Pet {
    id: ID!
    name: String!
    breed: String!
  }
  type Query {
    hello: String!
    pets: [Pet!]!
    pet(id: ID!): Pet!
  }
  type Mutation {
    addPet(id: ID!, name: String!, breed: String!): Pet!
    deletePet(id: ID!): Pet!
    updatePet(id: ID!, name: String!, breed: String!): Pet!
  }
`;

//Crear las queries y resolvers necesarios para poder ver la lista de todas las mascotas, filtrar por raza, añadir mascotas, modificar, borrar.
const resolvers = {
  Query: {
    pets: async (): Promise<Pet[]> =>{
      const petsModel = await PetModel.find().exec();  //este find devuelve un petmodeltype 
      const pets: Pet[] = petsModel.map((pet) => {
        return{
          id: pet._id.to_String(),
          name: pet.name,
          breed: pet.breed,
        }
      });
      return pets;
    },

    pet: async(_: unknown, args: { id: string }): Promise<Pet> => {
      const pet = await PetModel.findOne({_id: args.id}).exec();
      if(!pet){
        throw new GraphQLError (`No se ha encontrado ninguna mascota con ese ${args.id}`);
      }
      return{
        id: pet._id.to_String(),
        name: pet.name,
        breed: pet.breed,
      }
    },
  },

  Mutation: {
    filterPet: async (_: unknown, args: {breed: string}): Promise<Pet[]> => {
      const petModel = await PetModel.find({breed: args.breed}).exec();
        if(!petModel){
          throw new GraphQLError (`No se ha encontrado un perro con esa raza`);
        }
        const pet = petModel.map((pet)=> {
          return{
            id: pet._id.to_String(),
            name: pet.name,
            breed: pet.breed,
          }
        } )
        return pet;
      },

      addPet: (_: unknown, args: { id: string; name: string; breed: string }) => {
        const newPet =  new PetModel({id: args.id, name: args.name, breed: args.breed})
        newPet.save();

        return{
          id: newPet.id,
          name: newPet.name,
          breed: newPet.breed,
        };
      },

      deletePet: (_: unknown, args: { id: string }) => {
        const pet = PetModel.findOneAndDelete({_id: args.id});
        if (!pet) {
          throw new GraphQLError(`No se ha encontrado ninguna mascota con ese id:  ${args.id}`, {
          });
        }
        return pet;
      },

      updatePet: ( _: unknown, args: { id: string; name: string}) => {
        const pet = PetModel.findByIdAndUpdate(
          {_id: args.id},
          {name: args.name},
          {new: true});

        if (!pet) {
          throw new GraphQLError(`No pet found with id ${args.id}`);
        }

        return pet;
      },
    },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`Server ready at ${url}`);