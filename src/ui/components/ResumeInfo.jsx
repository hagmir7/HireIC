import React, { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function ResumeInfo({ resume_id }) {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const response = await api.get(`resumes/${resume_id}/view`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      alert("Erreur de chargement des données");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    function getLevel(number) {
        const map = {
            1: "A1",
            2: "A2",
            3: "B1",
            4: "B2",
            5: "C1",
            6: "C2",
        };

        return map[number] || null; // returns null if number not found
    }

  if (!data?.id) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Chargement du CV...
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white overflow-hidden border border-gray-200">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-4">
        <h1 className="text-xl font-bold">{data.full_name}</h1>
        <p className="text-sm mt-1">{data.email} • {data.phone}</p>
        <p className="text-sm">{data.address} — {data.city?.name}</p>
      </div>

      <div className="p-4 space-y-8">
        {/* Personal Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Informations Personnelles</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p><span className="font-semibold text-gray-700">CIN :</span> {data.cin}</p>
            <p><span className="font-semibold text-gray-700">Nationalité :</span> {data.nationality}</p>
            <p><span className="font-semibold text-gray-700">Date de naissance :</span> {data.birth_date}</p>
            <p><span className="font-semibold text-gray-700">Genre :</span> {data.gender === 1 ? "Homme" : "Femme"}</p>
            <p><span className="font-semibold text-gray-700">État civil :</span> {data.marital_status === 1 ? "Célibataire" : "Marié"}</p>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Formations</h2>
          {data.levels?.length > 0 ? (
            <ul className="space-y-3">
              {data.levels.map((level) => (
                <li key={level.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-gray-900">{level.pivot.name}</p>
                  <p className="text-sm text-gray-600">{level.pivot.institution}</p>
                  <p className="text-xs text-gray-500">Fin : {level.pivot.end_date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucune formation enregistrée.</p>
          )}
        </section>

        {/* Experiences */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Expériences Professionnelles</h2>
          {data.experiences?.length > 0 ? (
            <ul className="space-y-3">
              {data.experiences.map((exp) => (
                <li key={exp.id} className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-gray-900">{exp.work_post}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.start_date} → {exp.end_date || "Présent"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucune expérience professionnelle enregistrée.</p>
          )}
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Compétences</h2>
          {data.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-medium"
                >
                  {s.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune compétence enregistrée.</p>
          )}
        </section>

        {/* Languages */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">Langues</h2>
          {data.languages?.length > 0 ? (
            <ul className="space-y-2">
              {data.languages.map((lang) => (
                <li key={lang.language_id} className="text-sm text-gray-700">
                  Langue: {lang?.language?.name} — Niveau: <strong>{getLevel(lang.level)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucune langue enregistrée.</p>
          )}
        </section>

        {/* Footer */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 text-right">
            Créé le : {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
