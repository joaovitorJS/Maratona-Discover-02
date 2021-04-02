const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobUtils = require('../utils/JobUtils');

module.exports = {
  index(req, res) {

    let statusCount = {
      progress: 0,
      done: 0,
      total: Job.get().length
    };


    let jobTotalHours = 0;
    // ajustes no job
    // calculo de tempo restante
    const updatedJobs = Job.get().map((job) => {
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
        budget: JobUtils.calculateBudget(job, Profile.get()["value-hour"])
      };
    });

    // qtd de horas que quero trabalhar MENOS a quantidade de horas/dia de cada job em progresso
    const freeHours = Profile.get()['hours-per-day'] - jobTotalHours;

    return res.render("index", { jobs: updatedJobs, profile: Profile.get(), statusCount, freeHours });
  },

}