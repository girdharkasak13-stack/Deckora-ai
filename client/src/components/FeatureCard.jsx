function FeatureCard({ title, description }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-cyan-400 transition duration-300">

      <h3 className="text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="text-gray-400 mt-4 leading-8">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;