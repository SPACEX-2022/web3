import React, { PropsWithChildren } from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

interface ServiceCardProps {
  color: string;
  title: string;
  icon: JSX.Element;
  subtitle: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ color, title, icon, subtitle }: PropsWithChildren<ServiceCardProps>) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
)

const Services = () => {
  return (
    <div className="flex w-full justify-center items-center gradient-bg-services">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex-1 flex flex-col justify-start items-start">
          <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
            我们提供的服务
            <br />
            持续改进中
          </h1>
          <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
            购买和出售您的加密资产的最佳选择，
            我们提供的各种超级友好的服务
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-start items-center">
          <ServiceCard
            color="bg-[#2952E3]"
            title="安全保障"
            icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
            subtitle="安全有保障。我们始终保持隐私并保持我们产品的质量"
          />
          <ServiceCard
            color="bg-[#8945F8]"
            title="最佳汇率"
            icon={<BiSearchAlt fontSize={21} className="text-white" />}
            subtitle="安全有保障。我们始终保持隐私并保持我们产品的质量"
          />
          <ServiceCard
            color="bg-[#F84550]"
            title="最快的交易"
            icon={<RiHeart2Fill fontSize={21} className="text-white" />}
            subtitle="安全有保障。我们始终保持隐私并保持我们产品的质量"
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
