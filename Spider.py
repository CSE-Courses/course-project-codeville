from urllib.request import urlopen
from bs4 import BeautifulSoup
import psycopg2
import re
import time as t


conn=psycopg2.connect("postgres://sxvrsafzpkrfqh:7a0f0c61127a0096a017939504d84c2be34b5b2119cc726671ec237de1597127@ec2-52-71-153-228.compute-1.amazonaws.com:5432/dcnv7980km3uv0")
cur=conn.cursor()

cur.execute('DROP TABLE IF EXISTS Courses')
cur.execute('CREATE TABLE Courses (dname text, dabbr text, classID text, title text, section text, type text, days text, time text, room text, location text, instructor text)')

def updateTable(info):
    cur.execute("INSERT INTO Courses(dname, dabbr, classID, title, section, type, days, time, room, location, instructor) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",info)


url = "http://www.buffalo.edu/class-schedule?semester="
sem=''
while(sem==''):
    sem=input("Please enter a semester (fall/winter/spring/summer) to search for, or enter 0 to exit: ")
if sem=='0':
    print("Exitting")
    exit()
url=url+sem

print("Using URI", url)

html = urlopen(url).read()
soup = BeautifulSoup(html, "html.parser")
# class Courses:
#     credits=0
    # def __init__(self, dname,dabbr,classID,title,section,type,days,time,room,location,instructor):
    #     self.dname=dname
    #     self.dabbr=dabbr
    #     self.classID=classID
    #     self.title=title
    #     self.section=section
    #     self.type=type
    #     self.days=days
    #     self.time=time
    #     self.room=room
    #     self.location=location
    #     self.instructor=instructor
departments={}
dname=""
dabbr=""
classID=""
title=""
section=""
type=''
days=""
time=""
room=""
location=""
instructor=""
Links=[]
#credLink=""
i=0
x=None
#inst = Courses()

print("Retrieving Department Data")

for td in soup.find_all('td',class_='padding'):
    if i%2==0:
        Links.append(td.a.get('href'))
        x=td.a.string
        departments[x.strip()]=None
        #inst.dname=x.strip()
    if i%2==1:
        y=td.string
        departments[x.strip()]=y.strip()
        #inst.dabbr=y.strip()
        #objList.append(inst)
        #inst = Courses()
    i+=1
i=0

print("Retrieving Course data\n\n")

for link in Links:
    html=urlopen(Links[i]).read()
    i+=1
    soup=BeautifulSoup(html,'html.parser')
    dname= soup.select("td.subheader")[0].string.strip()
    dname=dname[12:]
    dname=dname.replace("'",'')

    print("Using URI",link,'\n')
    print("Retrieving course data of department:\n\n ----------",dname,"----------\n" )

    str=soup.select("td.padding")
    j=0
    for s in str:
        y=s.string
        if j%10==0:
            if y is None and s.find("</a>")!=-1:
                classID="<<< >>>"
                j+=1
            elif y is None:
                classID=""
            elif y.strip().isnumeric():
                classID=y.strip()
            # else:
            #     classID="0000"
            #     j+=1
            # else:
            #     classID=y.strip()
        elif j%10==1:
            j+=1
            continue
        elif j%10==2:
            if y is None:
                title=''
            else:
                title=y.strip()
        elif j%10==3:
            if y is None:
                section=''
            else:
                section=y.strip()
        elif j%10==4:
            if y is None:
                type=''
            else:
                type=y.strip()
        elif j%10==5:
            if y is None:
                days=''
            else:
                days=y.strip()
        elif j%10==6:
            if y is None:
                time=''
            else:
                time=y.strip()
                if time.find('-')!=-1:
                    lst=time.split('-')
                    lst[0]=lst[0].strip()
                    lst[1]=lst[1].strip()
                    time=lst[0]+' - '+lst[1]
        elif j%10==7:
            if y is None:
                room=''
            else:
                room=y.strip()
        elif j%10==8:
            if y is None:
                location=''
            else:
                location=y.strip()
        elif j%10==9:
            if y is None:
                instructor=''
            else:
                instructor=y.strip()
            info=(dname, departments[dname], classID, title, section, type, days, time, room, location,instructor,)
            updateTable(info)
        j+=1

    print("Commiting to database server\n\n")

    conn.commit()

    t.sleep(1.5)
            # course= Courses(dname, departments[dname], classID, title, section, type, days, time, room, location, instructor)
            # print(vars(course))

print("Retrieval complete!")

conn.commit()
cur.close()

# obj=objList[0]
# str=soup.select("td.padding")
# i=0
# for s in str:
#     x=s.string
#     if i%10==0:
#         obj.classID=x.strip()
#     if i%10==2:
#         obj.title=x.strip()
#     if i%10==3:
#         obj.section=x.strip()
#     if i%10==4:
#         obj.type=x.strip()
#     if i%10==5:
#         obj.days=x.strip()
#     if i%10==6:
#         obj.time=x.strip()
#     if i%10==7:
#         obj.room=x.strip()
#     if i%10==8:
#         obj.location=x.strip()
#     if i%10==9:
#         obj.instructor=x.strip()
#     i+=1
