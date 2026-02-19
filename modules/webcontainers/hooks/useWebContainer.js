// import { useState, useEffect, useCallback } from "react";
// import { WebContainer } from "@webcontainer/api";

// export const useWebContainer = ({ templateData }) => {
//   const [serverUrl, setServerUrl] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [instance, setInstance] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     async function initializeWebContainer() {
//       try {
//         const webcontainerInstance = await WebContainer.boot();

//         if (!mounted) return;

//         setInstance(webcontainerInstance);
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Failed to initialize WebContainer:", err);
//         if (mounted) {
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Failed to initialize WebContainer"
//           );
//           setIsLoading(false);
//         }
//       }
//     }

//     initializeWebContainer();

//     return () => {
//       mounted = false;
//       if (instance) {
//         instance.teardown();
//       }
//     };
//   }, []);

//   const writeFileSync = useCallback(
//     async (path, content) => {
//       if (!instance) {
//         throw new Error("WebContainer instance is not available");
//       }

//       try {
//         const pathParts = path.split("/");
//         const folderPath = pathParts.slice(0, -1).join("/");

//         if (folderPath) {
//           await instance.fs.mkdir(folderPath, { recursive: true });
//         }

//         await instance.fs.writeFile(path, content);
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to write file";
//         console.error(`Failed to write file at ${path}:`, err);
//         throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
//       }
//     },
//     [instance]
//   );

//   const destory = useCallback(() => {
//     if (instance) {
//       instance.teardown();
//       setInstance(null);
//       setServerUrl(null);
//     }
//   }, [instance]);

//   return {
//     serverUrl,
//     isLoading,
//     error,
//     instance,
//     writeFileSync,
//     destory,
//   };
// };


import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";

const getGlobalWebContainer = () => {
  if (!window.__webcontainer) {
    window.__webcontainer = {
      promise: null,
      instance: null,
    };
  }
  return window.__webcontainer;
};

export const useWebContainer = () => {
  const [instance, setInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const globalWC = getGlobalWebContainer();

        if (!globalWC.promise) {
          globalWC.promise = WebContainer.boot();
        }

        if (!globalWC.instance) {
          globalWC.instance = await globalWC.promise;
        }

        if (!mounted) return;

        setInstance(globalWC.instance);
        setIsLoading(false);
      } catch (err) {
        console.error("WebContainer init error:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to initialize WebContainer"
          );
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const writeFileSync = useCallback(async (path, content) => {
    const globalWC = getGlobalWebContainer();

    if (!globalWC.instance) {
      throw new Error("WebContainer not available");
    }

    const pathParts = path.split("/");
    const folderPath = pathParts.slice(0, -1).join("/");

    if (folderPath) {
      await globalWC.instance.fs.mkdir(folderPath, { recursive: true });
    }

    await globalWC.instance.fs.writeFile(path, content);
  }, []);

  const destroy = useCallback(() => {
    const globalWC = getGlobalWebContainer();

    if (globalWC.instance) {
      globalWC.instance.teardown();
      globalWC.instance = null;
      globalWC.promise = null;
    }
  }, []);

  return {
    instance,
    isLoading,
    error,
    writeFileSync,
    destroy,
  };
};
