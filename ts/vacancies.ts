interface Experience {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
  areas?: Area[];
}

interface AreasResponse {
  areas: Area[];
}

interface Salary {
  from?: number;
  to?: number;
  currency: string;
}

interface Vacancy {
  experience: Experience;
  salary?: Salary;
}

interface VacanciesResponse {
  pages: number;
  items: Vacancy[];
}

interface SalaryData {
  averageSalary: number;
  count: number;
  totalSalary: number;
}

const CITIES = new Set<string>([
  "Москва",
  "Казань",
  "Санкт-Петербург",
  "Пятигорск",
  "Владивосток",
]);

const API_URLS = {
  DICTIONARIES: "https://api.hh.ru/dictionaries",
  AREAS: "https://api.hh.ru/areas/113",
  VACANCIES:
    "https://api.hh.ru/vacancies?&search_field=name&text=frontend&only_with_salary=true&per_page=100&page=",
};

const CURRENCY_CONVERSION: Record<string, number> = {
  USD: 100,
  EUR: 105,
};

fetchAndDisplayAverageSalary();

async function fetchAndDisplayAverageSalary() {
  try {
    const { experience }: { experience: Experience[] } = await getData(
      API_URLS.DICTIONARIES
    );
    const areas: AreasResponse = await getData(API_URLS.AREAS);
    const cityIds = findCityIds(areas, CITIES);
    const cityIdQuery = cityIds.map((id) => `&area=${id}`).join("");
    const salaryDataByExperience = await fetchSalaries(
      API_URLS.VACANCIES,
      experience,
      cityIdQuery
    );
    console.table(salaryDataByExperience);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Ошибка при получении данных с сервера: ${error.message}, попробуйте ещё раз.`
      );
    } else {
      console.error("Неизвестная ошибка при получении данных с сервера.");
    }
  }
}

async function getData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`API error, ${response.status}`);
    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при получении данных: ${error.message}`);
    } else {
      throw new Error("Неизвестная ошибка при получении данных.");
    }
  }
}

function findCityIds(data: AreasResponse, cities: Set<string>): string[] {
  const foundIds: string[] = [];
  const stack = [...data.areas];

  while (stack.length > 0) {
    const area = stack.pop();
    if (area && cities.has(area.name)) {
      foundIds.push(`${area.id}`);
    }
    if (area && area.areas && area.areas.length > 0) {
      stack.push(...area.areas);
    }
  }
  return foundIds;
}

async function fetchSalaries(
  url: string,
  experience: Experience[],
  cityIdQuery: string
): Promise<Record<string, SalaryData>> {
  const results: Record<string, SalaryData> = experience.reduce((acc, curr) => {
    acc[curr.id] = { averageSalary: 0, count: 0, totalSalary: 0 };
    return acc;
  }, {} as Record<string, SalaryData>);

  const initialVacancies: VacanciesResponse = await getData<VacanciesResponse>(
    url + "0" + cityIdQuery
  );
  const totalPages = initialVacancies.pages;

  const fetchPromises = Array.from({ length: totalPages }, (_, page) =>
    getData<VacanciesResponse>(url + page + cityIdQuery)
  );
  const allVacancies = await Promise.all(fetchPromises);

  allVacancies.forEach((vacancies) => {
    vacancies.items.forEach((item) => {
      const experienceId = item.experience.id;
      const salaryValue = calculateSalary(item.salary);
      if (results[experienceId]) {
        results[experienceId].totalSalary += salaryValue;
        results[experienceId].count += 1;
      }
    });
  });
  for (const expId in results) {
    results[expId].averageSalary =
      results[expId].count > 0
        ? Math.round(results[expId].totalSalary / results[expId].count)
        : 0;
  }
  return results;
}

function calculateSalary(salary?: Salary): number {
  if (!salary) return 0;

  const { from, to, currency } = salary;
  const normalizedSalary = from && to ? (from + to) / 2 : from || to;

  return (normalizedSalary ?? 0) * (CURRENCY_CONVERSION[currency] || 1);
}
