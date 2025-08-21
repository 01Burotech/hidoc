import { gql } from "@apollo/client";

export const PHARMACIES_NEARBY = gql`
  query PharmaciesNearby($lat: Float!, $lng: Float!, $radiusKm: Float) {
    pharmaciesNearby(lat: $lat, lng: $lng, radiusKm: $radiusKm) {
      id
      nom
      adresse
      publicKey
      lat
      lng
      apiEndpoint
    }
  }
`;

export const PRESCRIPTIONS_QUERY = gql`
  query GetPrescription($id: String!) {
    prescription(id: $id) {
      id
      status
      pdfUrl
      createdAt
      items {
        id
        code
      }
    }
  }
`;

export const GET_PRESCRIPTION = gql`
  query GetPrescription($id: String!) {
    prescription(id: $id) {
      id
      status
      pdfUrl
      createdAt
      sentToPharmacies
      items {
        id
        code
        dosage
      }
    }
  }
`;

