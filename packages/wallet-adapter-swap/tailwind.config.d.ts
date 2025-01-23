declare const config: {
    darkMode: ["class"];
    content: string[];
    prefix: string;
    theme: {
        container: {
            center: true;
            padding: string;
            screens: {
                "2xl": string;
            };
        };
        extend: {
            fontFamily: {
                sans: [string, ...string[]];
            };
            colors: {
                border: string;
                input: string;
                ring: string;
                background: string;
                foreground: string;
                primary: {
                    DEFAULT: string;
                    foreground: string;
                };
                secondary: {
                    DEFAULT: string;
                    foreground: string;
                };
                destructive: {
                    DEFAULT: string;
                    foreground: string;
                };
                muted: {
                    DEFAULT: string;
                    foreground: string;
                };
                accent: {
                    DEFAULT: string;
                    foreground: string;
                };
                popover: {
                    DEFAULT: string;
                    foreground: string;
                };
                card: {
                    DEFAULT: string;
                    foreground: string;
                };
            };
            borderRadius: {
                lg: string;
                md: string;
                sm: string;
            };
            keyframes: {
                "accordion-down": {
                    from: {
                        height: string;
                    };
                    to: {
                        height: string;
                    };
                };
                "accordion-up": {
                    from: {
                        height: string;
                    };
                    to: {
                        height: string;
                    };
                };
            };
            animation: {
                "accordion-down": string;
                "accordion-up": string;
            };
        };
    };
    plugins: any[];
};
export default config;
//# sourceMappingURL=tailwind.config.d.ts.map