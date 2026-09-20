function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-5xl font-bold text-white">
        {title}
      </h2>

      <p className="text-gray-400 mt-5 text-lg">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionTitle;