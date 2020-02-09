from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import mysql.connector as sql
import credentials


app = Flask(__name__)
api = Api(app)
cors = CORS(app)


class PodToClient(Resource):
    #from pods 1 to 27, some numbers may be excluded - should i account for this?
    #format = {pod#:[clients]}
    #index 0 = pod, index 2 = client
    def format(self,res):
            keys = list(range(1,28))
            pcm = {key : [] for key in keys}
            for li in res:
                pcm[li[0]].append(li[2])
            return pcm

    def get(self):
        conn = sql.connect(host=credentials.HOST,
                           user=credentials.USER,
                           passwd=credentials.PASSWD,
                           database="quantum")
        cursor = conn.cursor()
        stmt = "SELECT * FROM quantum.pods_clients_map;"
        cursor.execute(stmt)
        result = cursor.fetchall()
        conn.close()
        return self.format(result)

#change the url destination
api.add_resource(PodToClient, '/pcm')

if __name__ == '__main__':
    app.run(debug=True)
