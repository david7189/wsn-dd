#!/bin/bash
username=${1}
cd ../XMLs/
mv ${username}*.xml ${SNEEROOT}/etc
cd ../downloads/
rm -f ${username}*
cd ${SNEEROOT}/etc/
cp ${SNEEROOT}/etc/wsn-dd.snee.properties ${SNEEROOT}/etc/${username}.wsn-dd.snee.properties
chmod 777 ${SNEEROOT}/etc/${username}.wsn-dd.snee.properties
sed -i "56s/.*/logical_schema = etc\/${username}_wsn-dd-logical-schema.xml/" ${username}.wsn-dd.snee.properties
sed -i "59s/.*/physical_schema = etc\/${username}_wsn-dd-physical-schema.xml/" ${username}.wsn-dd.snee.properties
sed -i "14s/.*/compiler.output_root_dir = ${username}_output/" ${username}.wsn-dd.snee.properties
sed -i "s/.*wsn-dd-topology.xml.*/\t\t<topology>etc\/${username}_wsn-dd-topology.xml<\/topology>/" ${username}_wsn-dd-physical-schema.xml
sed -i "s/.*wsn-dd-nodes.xml.*/\t\t<site-resources>etc\/${username}_wsn-dd-nodes.xml<\/site-resources>/" ${username}_wsn-dd-physical-schema.xml
cd ..
if [ -f ${SNEEROOT}/${username}_result.txt ]; then
  rm -f ${SNEEROOT}/${username}_result.txt
fi
touch ${SNEEROOT}/${username}_result.txt
chmod 777 ${SNEEROOT}/${username}_result.txt
query=$(head -n 1 ${SNEEROOT}/etc/${username}_wsn-dd-query.xml)
java -Xmx1024m uk/ac/manchester/cs/snee/client/SampleClient "etc/${username}.wsn-dd.snee.properties" "${query}" 120 "etc/${username}_wsn-dd-query-parameters.xml" null > ${username}_result.txt
firstLine=$(head -n 1 ${SNEEROOT}/${username}_result.txt)
echo ${firstLine} ${query}
if [[ ${firstLine} == *"Attributes for "* ]]; then
	cd ${username}_output/query1
	number=$(ls -1 ${SNEEROOT}/${username}_output/query1/query-plan/* | wc -l)
	if [ ${number} -gt 0 ]; then
		chmod -R 777 ${SNEEROOT}/${username}_output/query1/*
		rar a -ep1 ${SNEEROOT}/${username}_output/${username}_snee_files.rar ${SNEEROOT}/${username}_output/query1/* # >/dev/null
		chmod 777 ${SNEEROOT}/${username}_output/${username}_snee_files.rar
		echo "*O*K*"
	else
		echo "ERROR QUERY"
	fi
else
  echo "$(cat ${SNEEROOT}/logs/snee.log)"
fi
