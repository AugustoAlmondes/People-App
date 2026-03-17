const BASE_URL = 'https://randomuser.me/api';

export interface FetchUsersParams {
  page: number;
  results?: number;
  gender?: 'male' | 'female' | 'todos';
  nat?: string;
  seed?: string;
}

export async function fetchUsers(params: FetchUsersParams) {
  console.log("parametros", params);
  const query = new URLSearchParams({
    page: String(params.page),
    results: String(params.results ?? 20),
    seed: params.seed ? params.seed : "",
  });

  if (params.gender && params.gender !== 'todos') {
    query.append('gender', params.gender);
  }
  
  if (params.nat) {
    query.append('nat', params.nat);
  }

  console.log("query", query.toString());

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  if (!response.ok) throw new Error('Falha ao buscar usuários');
  return response.json();
}
