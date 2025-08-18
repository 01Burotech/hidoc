import { Prescription } from '../../entities/prescription.entity';

export function mapPrescriptionToFHIR(prescription: Prescription) {
  return {
    resourceType: 'MedicationRequest',
    id: prescription.id,
    subject: { reference: `Patient/${prescription.appointment.patient.id}` },
    medication: prescription.items.map((i) => ({
      code: i.code,
      display: i.denomination,
    })),
    dosageInstruction: prescription.items.map((i) => ({
      text: i.posologie,
      timing: { repeat: { duration: i.dureeJours } },
    })),
  };
}
