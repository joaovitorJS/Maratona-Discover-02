const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobUtils = require('../utils/JobUtils');

module.exports = {
  async index(req, res) {
    const profile = await Profile.get();
    const job = await Job.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: job.length
    };


    let jobTotalHours = 0;
    // ajustes no job
    // calculo de tempo restante
    const updatedJobs = job.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // status = done
      // statusCount[done] += 1
      // Somar a quantidade de status
      statusCount[status] += 1;

      jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      };
    });

    // qtd de horas que quero trabalhar MENOS a quantidade de horas/dia de cada job em progresso
    const freeHours = profile['hours-per-day'] - jobTotalHours;

    return res.render("index", { jobs: updatedJobs, profile: profile, statusCount, freeHours });
  },

}