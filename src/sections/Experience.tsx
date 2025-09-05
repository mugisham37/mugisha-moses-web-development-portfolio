import React from "react";
import Image from "next/image";

const Experience = () => {
  // Experience data array
  const experienceData = [
    {
      id: "2024",
      title: "Senior Full-Stack Engineer",
      data: [
        "Led development of enterprise SaaS platform serving 50K+ users",
        "Architected microservices with 99.9% uptime using Node.js & Docker",
        "Reduced API response time by 60% through optimization strategies",
      ],
    },
    {
      id: "2023",
      title: "Cloud Solutions Developer",
      data: [
        "Migrated legacy systems to AWS, cutting infrastructure costs by 40%",
        "Built real-time analytics dashboard processing 1M+ data points daily",
        "Implemented CI/CD pipelines reducing deployment time from hours to minutes",
        "Designed auto-scaling architecture handling 10x traffic spikes",
        "Established security protocols achieving SOC2 compliance",
      ],
    },
    {
      id: "2022",
      title: "AI Integration Specialist",
      data: [
        "Developed ML models increasing customer conversion rates by 35%",
        "Created intelligent chatbot handling 80% of customer inquiries automatically",
        "Built predictive analytics system saving company $2M annually",
        "Integrated computer vision APIs for automated quality control",
        "Delivered custom NLP solutions for document processing workflows",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="bg-white pt-12 sm:pt-16 md:pt-20 px-4 sm:px-6 md:px-12 lg:px-28"
    >
      <div className="max-w-8xl mx-auto">
        {/* Main heading */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[45px] font-normal text-gray-900 leading-tight sm:leading-relaxed md:leading-16">
            I&apos;ve spent years crafting innovative solutions that drive real
            business impact. My experience spans from startup environments to
            enterprise-scale applications, consistently delivering measurable
            results through cutting-edge technology.
          </h2>
        </div>

        {/* Experience label and description */}
        <div className="mb-12 sm:mb-14 md:mb-16 flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <div className="mb-6 sm:mb-8 lg:mb-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 tracking-wider uppercase">
              [MY EXPERIENCE]
            </p>
          </div>
          <div className="lg:max-w-[580px]">
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed sm:leading-6">
              From architecting scalable cloud infrastructure to implementing
              AI-driven solutions, I&apos;ve collaborated with cross-functional
              teams to build products that solve complex business challenges and
              create exceptional user experiences at every scale.
            </p>
          </div>
        </div>

        {/* Experience grid */}
        <div className="space-y-12 sm:space-y-16 md:space-y-20">
          {experienceData.map((experience) => (
            <div
              key={experience.id}
              className="flex flex-col lg:flex-row lg:flex-wrap gap-6 sm:gap-8 md:gap-12 lg:gap-20"
            >
              {/* Content Section */}
              <div className="flex-1 lg:min-w-80 order-1 lg:order-1">
                <div className="mb-6 sm:mb-8">
                  <span className="text-xs sm:text-sm font-medium text-gray-400 mb-2 block">
                    [{experience.id}]
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-4 sm:mb-6 md:mb-8">
                    {experience.title}
                  </h3>
                </div>

                <div className="text-xs sm:text-sm text-gray-600">
                  <div className="space-y-3 sm:space-y-4">
                    {experience.data.map((item: string, index: number) => (
                      <p key={index} className="leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="w-full sm:w-auto lg:min-w-80 lg:pl-8 order-2 lg:order-2">
                <div className="aspect-[16/10] sm:aspect-[3/2] lg:aspect-[2/1.5] bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={
                      experience.id === "2024"
                        ? "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        : experience.id === "2023"
                        ? "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={`${experience.title} workspace`}
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
