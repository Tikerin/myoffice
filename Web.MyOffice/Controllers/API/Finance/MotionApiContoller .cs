﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using System.Text;
using System.Data.Entity;
using System.Dynamic;

using ASE;
using ASE.EF;
using ASE.MVC;
using ASE.Json;

using Web.MyOffice.Data;
using MyBank.Models;
using Web.MyOffice.Models;
using System.Data.SqlClient;
using Method = System.Web.Http;

namespace Web.MyOffice.Controllers.API
{
    public class MotionsController : ControllerApiAdv<DB>
    {
        [Method.HttpPut]
        public HttpResponseMessage MotionsUpdate(List<Motion> motions)
        {
            using (db)
            {
                Motion updateMotion = null;
                foreach (var motion in motions)
                {
                    updateMotion = db.Motions.Find(motion.Id);
                    updateMotion.Deleted = motion.Deleted;
                    db.Entry(updateMotion).State = EntityState.Modified;
                }
                db.SaveChanges();
            }
            return ResponseObject2Json(HttpStatusCode.Accepted);
        }

        [Method.HttpDelete]
        public HttpResponseMessage MotionDelete(Guid motionId)
        {
            using (db)
            {
                db.Entry(db.Motions.Find(motionId)).State = EntityState.Deleted;
                db.SaveChanges();
            }
            return ResponseObject2Json(HttpStatusCode.Accepted);
        }

        public class MotionMerge
        {
            public Item mainItem { set; get; }
            public Item selectedItem { set; get; }
        }

        [Method.HttpPost]
        public HttpResponseMessage ItemMerge(MotionMerge motionMerge)
        {
            var mainItem = motionMerge.mainItem;
            var selectedItem = motionMerge.selectedItem;

            using (db)
            {
                Motion curMotion = null;
                foreach (var motion in selectedItem.Motions)
                {
                    curMotion = db.Motions.Find(motion.Id);
                    curMotion.ItemId = motion.ItemId;
                    db.Entry(curMotion).State = EntityState.Modified;
                }
                db.SaveChanges();
                db.Entry(db.Items.Find(selectedItem.Id)).State = EntityState.Deleted;
                db.SaveChanges();
            }
            return ResponseObject2Json(HttpStatusCode.Moved);
        }
    }
}