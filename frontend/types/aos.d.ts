declare module "aos" {
  const AOS: {
    init(options?: {
      duration?: number;
      easing?: string;
      once?: boolean;
      offset?: number;
      disable?: boolean | (() => boolean);
    }): void;
  };
  export default AOS;
}
