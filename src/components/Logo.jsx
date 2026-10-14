const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/Inba’s Mr & Mrs Gifts Logo.png"
        alt="Mr & Mrs Gifts"
        className="h-11 w-auto rounded-xl object-contain shadow-[0_14px_28px_rgba(135,206,235,0.22)]"
      />
      <div className="leading-none">
        <p className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-white">
          Mr & Mrs Gifts
        </p>
      </div>
    </div>
  );
};

export default Logo;
