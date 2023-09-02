class StorageManager {
  static setItem(key: string, value: unknown) {
    if (!import.meta.env.PROD) {
      // Prevent current "Production" build from leaving a mess for testers
      localStorage.setItem("totum-routing." + key, JSON.stringify(value));
    }
  }

  static getItem(key: string) {
    const data = localStorage.getItem("totum-routing." + key);
    return data ? JSON.parse(data) : null;
  }

  static removeItem(key: string) {
    localStorage.removeItem("totum-routing." + key);
  }
}

export default StorageManager;
