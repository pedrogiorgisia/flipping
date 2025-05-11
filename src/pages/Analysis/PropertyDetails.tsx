
import React from "react";
import {
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaHashtag,
} from "react-icons/fa";

interface PropertyDetailsProps {
  property: any;
  formatCurrency: (value: number) => string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  formatCurrency,
}) => {
  if (!property) return null;

  const detailItems = [
    { icon: <FaMapMarkerAlt />, label: "Endereço", value: property.endereco },
    { icon: <FaRulerCombined />, label: "Área", value: `${property.area} m²` },
    {
      icon: <FaMoneyBillWave />,
      label: "Preço Anunciado",
      value: formatCurrency(property.preco_anunciado),
    },
    { icon: <FaBuilding />, label: "Imobiliária", value: property.imobiliaria },
    {
      icon: <FaCalendarAlt />,
      label: "Data do Anúncio",
      value: property.data_anuncio
        ? new Date(property.data_anuncio).toLocaleDateString("pt-BR")
        : "Não disponível",
    },
    {
      icon: <FaHashtag />,
      label: "Código de Referência",
      value: property.codigo_ref_externo,
    },
    { icon: <FaBed />, label: "Quartos", value: property.quartos },
    { icon: <FaBath />, label: "Banheiros", value: property.banheiros },
    { icon: <FaCar />, label: "Vagas", value: property.vagas },
    {
      icon: <FaMoneyBillWave />,
      label: "Condomínio Mensal",
      value: formatCurrency(property.condominio_mensal),
    },
    {
      icon: <FaFileInvoiceDollar />,
      label: "IPTU Anual",
      value: formatCurrency(property.iptu_anual),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Detalhes do Imóvel</h2>
        <a
          href={property.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Ver anúncio
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {detailItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="text-blue-600 text-xl">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-medium text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      {property.comentarios && (
        <div className="border-t pt-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-xl mt-1">
              <FaFileInvoiceDollar className="text-blue-600" />
            </div>
            <div className="w-full">
              <p className="text-sm text-gray-500">Comentários</p>
              <p className="font-medium text-gray-800 whitespace-pre-line">
                {property.comentarios || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
