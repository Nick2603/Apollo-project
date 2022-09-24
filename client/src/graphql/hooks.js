import { useQuery, useMutation } from "@apollo/client";
import { JOBS_QUERY, JOB_QUERY, COMPANY_QUERY, CREATE_JOB_MUTATION } from "./queries";
import { getAccessToken } from "../auth";

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, { fetchPolicy: "network-only" });
  return {
    jobs: data?.jobs,
    loading,
    error,
  };
}

export function useJob(jobId) {
  const { data, loading, error } = useQuery(JOB_QUERY, { variables: { jobId } });
  return {
    job: data?.job,
    loading,
    error,
  };
}

export function useCompany(companyId) {
  const { data, loading, error } = useQuery(COMPANY_QUERY, { variables: { companyId } });
  return {
    company: data?.company,
    loading,
    error,
  };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);
  return {
    createJob: async (title, description) => {
      const {
        data: { job },
      } = await mutate({
        variables: { input: { title, description } },
        context: {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
        update: (cache, { data: { job } }) => {
          cache.writeQuery({
            query: JOB_QUERY,
            variables: { jobId: job.id },
            data: { job },
          });
        },
      });
      return job;
    },
    loading,
    error,
  };
}
