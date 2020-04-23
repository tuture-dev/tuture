export async function saveData(data: unknown, url: string) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch {
    return false;
  }
}
