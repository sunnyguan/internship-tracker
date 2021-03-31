function Footer() {
  return (
    <div className="p-4 text-center bg-blue-100 grid grid-cols-1 md:grid-cols-3 md:divide-x-2 divide-blue-400">
      <div className="px-4">
        Check out the project on{" "}
        <a
          href="https://github.com/sunnyguan/internship-tracker"
          className="underline text-blue-700"
        >
          GitHub
        </a>{" "}
      </div>

      <div className="px-4">
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/sunny-guan/"
          className="underline text-blue-700"
        >
          Sunny Guan
        </a>
      </div>
      <div className="px-4">
        View the <a
          href="https://github.com/sunnyguan/internship-tracker#features"
          className="underline text-blue-700"
        >
          features list
        </a>
      </div>
    </div>
  );
}

export default Footer;
