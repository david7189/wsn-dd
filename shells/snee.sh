#!/bin/bash
cd ../XMLs
username=${1}
mv ${username}*.xml ${SNEEROOT}/etc
cd ${SNEEROOT}/etc
cp wsn-dd.snee.properties ${username}.wsn-dd.snee.properties
chmod 777 ${username}.wsn-dd.snee.properties
sed -i "56s/.*/logical_schema = etc\/${username}_wsn-dd-logical-schema.xml/" ${username}.wsn-dd.snee.properties
sed -i "59s/.*/physical_schema = etc\/${username}_wsn-dd-physical-schema.xml/" ${username}.wsn-dd.snee.properties
sed -i "14s/.*/compiler.output_root_dir = ${username}_output/" ${username}.wsn-dd.snee.properties
sed -i "s/.*wsn-dd-topology.xml.*/\t\t<topology>etc\/${username}_wsn-dd-topology.xml<\/topology>/" ${username}_wsn-dd-physical-schema.xml
sed -i "s/.*wsn-dd-nodes.xml.*/\t\t<site-resources>etc\/${username}_wsn-dd-nodes.xml<\/site-resources>/" ${username}_wsn-dd-physical-schema.xml
cd ..
rm ${username}_result.txt
touch ${username}_result.txt
chmod 777 ${username}_result.txt
query="$(cat etc/${username}_wsn-dd-query.xml)"
java -Xmx1024m uk/ac/manchester/cs/snee/client/SampleClient "etc/${username}.wsn-dd.snee.properties" "${query}" 120 "etc/${username}_wsn-dd-query-parameters.xml" null > ${username}_result.txt
firstLine="$(head -n 1 ${username}_result.txt)"
if [[ ${firstLine} == *"Attributes for "* ]] ; then
	cd ${username}_output/query1/query-plan
	number="$(ls -1 | wc -l)"
	if [ ${number} -gt 0 ]; then
		echo "*O*K*"
		cd ..
		chmod -R 777 *
		rar a ${username}_snee_files.rar query-plan/
		chmod 777 ${username}_snee_files.rar
	else
		echo "QUERY"
	fi
else
	echo "$(cat logs/snee.log)"
fi
